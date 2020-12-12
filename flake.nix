{
  description = "The New MRB Mythology";

  inputs.nixpkgs.url = "github:NixOS/Nixpkgs/nixos-unstable";

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

      nixosModules.backend = import ./backend/module.nix;

      packages = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          homepage =
            let
              node = import ./node-packages.nix
                {
                  inherit (pkgs) fetchurl fetchgit;
                  nodeEnv = import ./node-env.nix {
                    inherit (pkgs) stdenv python2 utillinux runCommand writeTextFile nodejs;
                    libtool = null;
                  };
                };
            in
            node.package.override {
              src = builtins.filterSource
                (path: type:
                  (type != "directory" || baseNameOf path != ".git") &&
                  (type != "directory" || baseNameOf path != "Tiles") &&
                  (type != "directory" || baseNameOf path != "backend") &&
                  (type != "regular" || baseNameOf path != "flake.nix") &&
                  (type != "regular" || baseNameOf path != "node-packages.nix") &&
                  (type != "regular" || baseNameOf path != "node-env.nix") &&
                  (type != "symlink")
                )
                ./.;
              postInstall = ''
                ln -s ${./Tiles} Tiles
              '';
            };
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
            nodePackages.node2nix
            rustc
            cargo
            sqlite
          ];
        }
      );

    };

}
