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

      packages = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          homepage = pkgs.stdenv.mkDerivation {
            name = "mrb-mythology-homepage";
            src = pkgs.lib.sourceByRegex ./. [
              "^index.html$"
              "^index.js$"
              "^Leaflet.Control.Custom.js$"
              "^Leaflet.MousePosition"
              "^marker_green.png$"
              "^style.css$"
              "^Tiles"
            ];
            installPhase = ''
              mkdir -p $out
              cp -r * $out/
            '';
          };

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
          ];
        }
      );

    };

}
