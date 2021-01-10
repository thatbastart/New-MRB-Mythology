{ config, lib, pkgs, ... }:

with lib;
let
  cfg = config.services.mrb-mythology-backend;
in
{

  options.services.mrb-mythology-backend = {
    enable = mkEnableOption
      "Backend for the Mississippi Mythology";

    port = mkOption {
      type = types.port;
      description = "TCP port to bind to";
    };

  };

  config = mkIf cfg.enable {

    systemd.services.mrb-mythology-backend = {
      description = "MRB Mythology Backend";
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        Type = "simple";
        ExecStart = ''
          ${pkgs.mrb-mythology-backend}/bin/mrb-mythology-backend \
            --db /var/lib/mrb-mythology-backend/db.sqlite \
            --port ${builtins.toString cfg.port}
        '';
        Restart = "always";
        StateDirectory = "mrb-mythology-backend";
        DynamicUser = true;
      };

    };
  };
}
