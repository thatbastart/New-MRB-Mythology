{
  description = "The New MRB Mythology";

  outputs =
    { self
    , nixpkgs
    }:
    let
      forAllSystems = f: nixpkgs.lib.genAttrs
        [ "x86_64-linux" "i686-linux" "aarch64-linux" ]
        (system: f system);
      nixpkgsFor = forAllSystems (
        system:
        import nixpkgs { inherit system; }
      );
    in
    rec {

      nixosModules.module =
        { config, ... }:
        let
          mrbPkgs = self.packages.${config.nixpkgs.localSystem.system};
          # random port
          port = "37937";
          stateDir = "/var/lib/mrb-mythology-backend";
        in
        {

          systemd.services.mrb-mythology-backend = {
            description = "MRB Mythology Backend";
            after = [ "network.target" ];
            wantedBy = [ "multi-user.target" ];

            serviceConfig = {
              Type = "simple";
              ExecStart = ''
                ${mrbPkgs.backend}/bin/mrb-mythology-backend \
                  --db ${stateDir}/db.sqlite \
                  --port ${port}
              '';
              Restart = "always";
              StateDirectory = "mrb-mythology-backend";
            };

          };

          services.nginx.virtualHosts."mississippi.erictapen.name" = {
            locations."/".root = "${mrbPkgs.homepage}/lib/node_modules/interactive_test/";
            locations."/stories/".root = "${mrbPkgs.static}";
            locations."/Tiles/".root = "${stateDir}/tiles/";
            locations."/images/".root = "${stateDir}/images/";
            locations."/api/".proxyPass =
              "http://[::1]:${port}";
            enableACME = true;
            forceSSL = true;
          };

        };

      packages = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          homepage =
            let
              node = pkgs.callPackage ./node-packages.nix
                {
                  nodeEnv = pkgs.callPackage ./node-env.nix { };
                };
            in
            node.package.override {
              src = builtins.filterSource
                (path: type:
                  (type != "directory" || baseNameOf path != ".git") &&
                  (type != "directory" || baseNameOf path != "Tiles") &&
                  (type != "directory" || baseNameOf path != "backend") &&
                  (type != "directory" || baseNameOf path != "stories") &&
                  (type != "regular" || baseNameOf path != "flake.nix") &&
                  (type != "regular" || baseNameOf path != "node-packages.nix") &&
                  (type != "regular" || baseNameOf path != "node-env.nix") &&
                  (type != "regular" || baseNameOf path != "module.nix") &&
                  (type != "symlink")
                )
                ./.;
              postInstall =
                let
                  gitRevision =
                    if (self ? rev)
                    then
                      "<a href='https://github.com/The-bastART/New-MRB-Mythology/commit/${self.rev}'><code>${self.rev}</code></a>"
                    else "dirty checkout";
                in
                ''
                  ln -s ${pkgs.google-fonts}/share/fonts fonts/google-fonts
                  sed -i 's|VERSIONVERSIONVERSION|${gitRevision}|g' index.html
                '';
            };
          static = pkgs.linkFarm "static" [
            {
              name = "stories";
              path = [ (pkgs.copyPathToStore ./stories) ];
            }
          ];
          backend =
            let
              crates = import ./backend/Cargo.nix { inherit pkgs; };
            in
            crates.workspaceMembers.mrb-mythology-backend.build;
        });

      devShell = forAllSystems (
        system:
        let
          pkgs = nixpkgsFor.${system};
        in
        pkgs.mkShell {
          buildInputs = with pkgs; [
            darkhttpd
            lighttpd
            nodePackages.node2nix
            rustc
            cargo
            rustfmt
            sqlite
          ];
        }
      );

    };

}
