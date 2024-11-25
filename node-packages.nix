# This file has been generated by node2nix 1.11.1. Do not edit!

{nodeEnv, fetchurl, fetchgit, nix-gitignore, stdenv, lib, globalBuildInputs ? []}:

let
  sources = {
    "@clr/icons-4.0.16" = {
      name = "_at_clr_slash_icons";
      packageName = "@clr/icons";
      version = "4.0.16";
      src = fetchurl {
        url = "https://registry.npmjs.org/@clr/icons/-/icons-4.0.16.tgz";
        sha512 = "SgPkIemUZXXdeWVMzKNOrWKpfXlI+2mRtrZe4sQtBTT3TRMh8CSYAhSWuJTrtLRyttILAIXtYtcIQ7E7UGKz6A==";
      };
    };
    "@popperjs/core-2.11.7" = {
      name = "_at_popperjs_slash_core";
      packageName = "@popperjs/core";
      version = "2.11.7";
      src = fetchurl {
        url = "https://registry.npmjs.org/@popperjs/core/-/core-2.11.7.tgz";
        sha512 = "Cr4OjIkipTtcXKjAsm8agyleBuDHvxzeBoa1v543lbv1YaIwQjESsVcmjiWiPEbC1FIeHOG/Op9kdCmAmiS3Kw==";
      };
    };
    "@types/geojson-7946.0.10" = {
      name = "_at_types_slash_geojson";
      packageName = "@types/geojson";
      version = "7946.0.10";
      src = fetchurl {
        url = "https://registry.npmjs.org/@types/geojson/-/geojson-7946.0.10.tgz";
        sha512 = "Nmh0K3iWQJzniTuPRcJn5hxXkfB1T1pgB89SBig5PlJQU5yocazeu4jATJlaA0GYFKWMqDdvYemoSnF2pXgLVA==";
      };
    };
    "@types/leaflet-1.9.3" = {
      name = "_at_types_slash_leaflet";
      packageName = "@types/leaflet";
      version = "1.9.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/@types/leaflet/-/leaflet-1.9.3.tgz";
        sha512 = "Caa1lYOgKVqDkDZVWkto2Z5JtVo09spEaUt2S69LiugbBpoqQu92HYFMGUbYezZbnBkyOxMNPXHSgRrRY5UyIA==";
      };
    };
    "@webcomponents/custom-elements-1.4.3" = {
      name = "_at_webcomponents_slash_custom-elements";
      packageName = "@webcomponents/custom-elements";
      version = "1.4.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/@webcomponents/custom-elements/-/custom-elements-1.4.3.tgz";
        sha512 = "iD0YW46SreUQANGccywK/eC+gZELNHocZZrY2fGwrIlx/biQOTkAF9IohisibHbrmIHmA9pVCIdGwzfO+W0gig==";
      };
    };
    "ansi-regex-4.1.1" = {
      name = "ansi-regex";
      packageName = "ansi-regex";
      version = "4.1.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/ansi-regex/-/ansi-regex-4.1.1.tgz";
        sha512 = "ILlv4k/3f6vfQ4OoP2AGvirOktlQ98ZEL1k9FaQjxa3L1abBgbuTDAdPOpvbGncC0BTVQrl+OM8xZGK6tWXt7g==";
      };
    };
    "ansi-styles-3.2.1" = {
      name = "ansi-styles";
      packageName = "ansi-styles";
      version = "3.2.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz";
        sha512 = "VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==";
      };
    };
    "camelcase-5.3.1" = {
      name = "camelcase";
      packageName = "camelcase";
      version = "5.3.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/camelcase/-/camelcase-5.3.1.tgz";
        sha512 = "L28STB170nwWS63UjtlEOE3dldQApaJXZkOI1uMFfzf3rRuPegHaHesyee+YxQ+W6SvRDQV6UrdOdRiR153wJg==";
      };
    };
    "cliui-5.0.0" = {
      name = "cliui";
      packageName = "cliui";
      version = "5.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/cliui/-/cliui-5.0.0.tgz";
        sha512 = "PYeGSEmmHM6zvoef2w8TPzlrnNpXIjTipYK780YswmIP9vjxmd6Y2a3CB2Ks6/AU8NHjZugXvo8w3oWM2qnwXA==";
      };
    };
    "color-convert-1.9.3" = {
      name = "color-convert";
      packageName = "color-convert";
      version = "1.9.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz";
        sha512 = "QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==";
      };
    };
    "color-name-1.1.3" = {
      name = "color-name";
      packageName = "color-name";
      version = "1.1.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz";
        sha512 = "72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==";
      };
    };
    "complex.js-2.1.1" = {
      name = "complex.js";
      packageName = "complex.js";
      version = "2.1.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/complex.js/-/complex.js-2.1.1.tgz";
        sha512 = "8njCHOTtFFLtegk6zQo0kkVX1rngygb/KQI6z1qZxlFI3scluC+LVTCFbrkWjBv4vvLlbQ9t88IPMC6k95VTTg==";
      };
    };
    "decamelize-1.2.0" = {
      name = "decamelize";
      packageName = "decamelize";
      version = "1.2.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/decamelize/-/decamelize-1.2.0.tgz";
        sha512 = "z2S+W9X73hAUUki+N+9Za2lBlun89zigOyGrsax+KUQ6wKW4ZoWpEYBkGhQjwAjjDCkWxhY0VKEhk8wzY7F5cA==";
      };
    };
    "decimal.js-10.4.3" = {
      name = "decimal.js";
      packageName = "decimal.js";
      version = "10.4.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/decimal.js/-/decimal.js-10.4.3.tgz";
        sha512 = "VBBaLc1MgL5XpzgIP7ny5Z6Nx3UrRkIViUkPUdtl9aya5amy3De1gsUUSB1g3+3sExYNjCAsAznmukyxCb1GRA==";
      };
    };
    "emoji-regex-7.0.3" = {
      name = "emoji-regex";
      packageName = "emoji-regex";
      version = "7.0.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/emoji-regex/-/emoji-regex-7.0.3.tgz";
        sha512 = "CwBLREIQ7LvYFB0WyRvwhq5N5qPhc6PMjD6bYggFlI5YyDgl+0vxq5VHbMOFqLg7hfWzmu8T5Z1QofhmTIhItA==";
      };
    };
    "escape-latex-1.2.0" = {
      name = "escape-latex";
      packageName = "escape-latex";
      version = "1.2.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/escape-latex/-/escape-latex-1.2.0.tgz";
        sha512 = "nV5aVWW1K0wEiUIEdZ4erkGGH8mDxGyxSeqPzRNtWP7ataw+/olFObw7hujFWlVjNsaDFw5VZ5NzVSIqRgfTiw==";
      };
    };
    "find-up-3.0.0" = {
      name = "find-up";
      packageName = "find-up";
      version = "3.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/find-up/-/find-up-3.0.0.tgz";
        sha512 = "1yD6RmLI1XBfxugvORwlck6f75tYL+iR0jqwsOrOxMZyGYqUuDhJ0l4AXdO1iX/FTs9cBAMEk1gWSEx1kSbylg==";
      };
    };
    "fraction.js-4.2.0" = {
      name = "fraction.js";
      packageName = "fraction.js";
      version = "4.2.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/fraction.js/-/fraction.js-4.2.0.tgz";
        sha512 = "MhLuK+2gUcnZe8ZHlaaINnQLl0xRIGRfcGk2yl8xoQAfHrSsL3rYu6FCmBdkdbhc9EPlwyGHewaRsvwRMJtAlA==";
      };
    };
    "get-caller-file-2.0.5" = {
      name = "get-caller-file";
      packageName = "get-caller-file";
      version = "2.0.5";
      src = fetchurl {
        url = "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz";
        sha512 = "DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==";
      };
    };
    "is-fullwidth-code-point-2.0.0" = {
      name = "is-fullwidth-code-point";
      packageName = "is-fullwidth-code-point";
      version = "2.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-2.0.0.tgz";
        sha512 = "VHskAKYM8RfSFXwee5t5cbN5PZeq1Wrh6qd5bkyiXIf6UQcN6w/A0eXM9r6t8d+GYOh+o6ZhiEnb88LN/Y8m2w==";
      };
    };
    "javascript-natural-sort-0.7.1" = {
      name = "javascript-natural-sort";
      packageName = "javascript-natural-sort";
      version = "0.7.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/javascript-natural-sort/-/javascript-natural-sort-0.7.1.tgz";
        sha512 = "nO6jcEfZWQXDhOiBtG2KvKyEptz7RVbpGP4vTD2hLBdmNQSsCiicO2Ioinv6UI4y9ukqnBpy+XZ9H6uLNgJTlw==";
      };
    };
    "leaflet-1.9.4" = {
      name = "leaflet";
      packageName = "leaflet";
      version = "1.9.4";
      src = fetchurl {
        url = "https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz";
        sha512 = "nxS1ynzJOmOlHp+iL3FyWqK89GtNL8U8rvlMOsQdTTssxZwCXh8N2NB3GDQOL+YR3XnWyZAxwQixURb+FA74PA==";
      };
    };
    "leaflet-rotate-map-0.2.6" = {
      name = "leaflet-rotate-map";
      packageName = "leaflet-rotate-map";
      version = "0.2.6";
      src = fetchurl {
        url = "https://registry.npmjs.org/leaflet-rotate-map/-/leaflet-rotate-map-0.2.6.tgz";
        sha512 = "RjA8h8SjXNU8ZZEv2iFUdH9mUw1JzyzU+vSnBuhOHuXas2HJzDN/7PakJnyyn7JGeCc8IuRHTlS+bmyrV4NYGw==";
      };
    };
    "locate-path-3.0.0" = {
      name = "locate-path";
      packageName = "locate-path";
      version = "3.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/locate-path/-/locate-path-3.0.0.tgz";
        sha512 = "7AO748wWnIhNqAuaty2ZWHkQHRSNfPVIsPIfwEOWO22AmaoVrWavlOcMR5nzTLNYvp36X220/maaRsrec1G65A==";
      };
    };
    "mathjs-8.1.1" = {
      name = "mathjs";
      packageName = "mathjs";
      version = "8.1.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/mathjs/-/mathjs-8.1.1.tgz";
        sha512 = "b3TX3EgiZObujjwb8lZnTDLUuivC2jar4ZBjmGJ4stFYCDXx/DNwx5yry5t/z65p9mvejyZel1qoeR05KtChcQ==";
      };
    };
    "p-limit-2.3.0" = {
      name = "p-limit";
      packageName = "p-limit";
      version = "2.3.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/p-limit/-/p-limit-2.3.0.tgz";
        sha512 = "//88mFWSJx8lxCzwdAABTJL2MyWB12+eIY7MDL2SqLmAkeKU9qxRvWuSyTjm3FUmpBEMuFfckAIqEaVGUDxb6w==";
      };
    };
    "p-locate-3.0.0" = {
      name = "p-locate";
      packageName = "p-locate";
      version = "3.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/p-locate/-/p-locate-3.0.0.tgz";
        sha512 = "x+12w/To+4GFfgJhBEpiDcLozRJGegY+Ei7/z0tSLkMmxGZNybVMSfWj9aJn8Z5Fc7dBUNJOOVgPv2H7IwulSQ==";
      };
    };
    "p-try-2.2.0" = {
      name = "p-try";
      packageName = "p-try";
      version = "2.2.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/p-try/-/p-try-2.2.0.tgz";
        sha512 = "R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==";
      };
    };
    "p5-1.6.0" = {
      name = "p5";
      packageName = "p5";
      version = "1.6.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/p5/-/p5-1.6.0.tgz";
        sha512 = "RowF+RxfVUhJm/YKXL5TCFzTqnwAIwK6W1VGs9LAqSf3PCmLz9Igbxzlf0Ry5IMV71L42wipCdH/bDiNsqAstA==";
      };
    };
    "path-exists-3.0.0" = {
      name = "path-exists";
      packageName = "path-exists";
      version = "3.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/path-exists/-/path-exists-3.0.0.tgz";
        sha512 = "bpC7GYwiDYQ4wYLe+FA8lhRjhQCMcQGuSgGGqDkg/QerRWw9CmGRT0iSOVRSZJ29NMLZgIzqaljJ63oaL4NIJQ==";
      };
    };
    "require-directory-2.1.1" = {
      name = "require-directory";
      packageName = "require-directory";
      version = "2.1.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz";
        sha512 = "fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==";
      };
    };
    "require-main-filename-2.0.0" = {
      name = "require-main-filename";
      packageName = "require-main-filename";
      version = "2.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/require-main-filename/-/require-main-filename-2.0.0.tgz";
        sha512 = "NKN5kMDylKuldxYLSUfrbo5Tuzh4hd+2E8NPPX02mZtn1VuREQToYe/ZdlJy+J3uCpfaiGF05e7B8W0iXbQHmg==";
      };
    };
    "seedrandom-3.0.5" = {
      name = "seedrandom";
      packageName = "seedrandom";
      version = "3.0.5";
      src = fetchurl {
        url = "https://registry.npmjs.org/seedrandom/-/seedrandom-3.0.5.tgz";
        sha512 = "8OwmbklUNzwezjGInmZ+2clQmExQPvomqjL7LFqOYqtmuxRgQYqOD3mHaU+MvZn5FLUeVxVfQjwLZW/n/JFuqg==";
      };
    };
    "set-blocking-2.0.0" = {
      name = "set-blocking";
      packageName = "set-blocking";
      version = "2.0.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/set-blocking/-/set-blocking-2.0.0.tgz";
        sha512 = "KiKBS8AnWGEyLzofFfmvKwpdPzqiy16LvQfK3yv/fVH7Bj13/wl3JSR1J+rfgRE9q7xUJK4qvgS8raSOeLUehw==";
      };
    };
    "showdown-1.9.1" = {
      name = "showdown";
      packageName = "showdown";
      version = "1.9.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/showdown/-/showdown-1.9.1.tgz";
        sha512 = "9cGuS382HcvExtf5AHk7Cb4pAeQQ+h0eTr33V1mu+crYWV4KvWAw6el92bDrqGEk5d46Ai/fhbEUwqJ/mTCNEA==";
      };
    };
    "showdown-htmlescape-0.1.9" = {
      name = "showdown-htmlescape";
      packageName = "showdown-htmlescape";
      version = "0.1.9";
      src = fetchurl {
        url = "https://registry.npmjs.org/showdown-htmlescape/-/showdown-htmlescape-0.1.9.tgz";
        sha512 = "kkg0Lh6CRzJKMvIkNBYNkZaJiZSii98mfiZj3FpQK0lXn1iV0UT5VD63YoTAqOCP7QiIo3nTH/z5ndVKCfMenQ==";
      };
    };
    "string-width-3.1.0" = {
      name = "string-width";
      packageName = "string-width";
      version = "3.1.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/string-width/-/string-width-3.1.0.tgz";
        sha512 = "vafcv6KjVZKSgz06oM/H6GDBrAtz8vdhQakGjFIvNrHA6y3HCF1CInLy+QLq8dTJPQ1b+KDUqDFctkdRW44e1w==";
      };
    };
    "strip-ansi-5.2.0" = {
      name = "strip-ansi";
      packageName = "strip-ansi";
      version = "5.2.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz";
        sha512 = "DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==";
      };
    };
    "tiny-emitter-2.1.0" = {
      name = "tiny-emitter";
      packageName = "tiny-emitter";
      version = "2.1.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/tiny-emitter/-/tiny-emitter-2.1.0.tgz";
        sha512 = "NB6Dk1A9xgQPMoGqC5CVXn123gWyte215ONT5Pp5a0yt4nlEoO1ZWeCwpncaekPHXO60i47ihFnZPiRPjRMq4Q==";
      };
    };
    "tippy.js-6.3.7" = {
      name = "tippy.js";
      packageName = "tippy.js";
      version = "6.3.7";
      src = fetchurl {
        url = "https://registry.npmjs.org/tippy.js/-/tippy.js-6.3.7.tgz";
        sha512 = "E1d3oP2emgJ9dRQZdf3Kkn0qJgI6ZLpyS5z6ZkY1DF3kaQaBsGZsndEpHwx+eC+tYM41HaSNvNtLx8tU57FzTQ==";
      };
    };
    "typed-function-2.1.0" = {
      name = "typed-function";
      packageName = "typed-function";
      version = "2.1.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/typed-function/-/typed-function-2.1.0.tgz";
        sha512 = "bctQIOqx2iVbWGDGPWwIm18QScpu2XRmkC19D8rQGFsjKSgteq/o1hTZvIG/wuDq8fanpBDrLkLq+aEN/6y5XQ==";
      };
    };
    "which-module-2.0.1" = {
      name = "which-module";
      packageName = "which-module";
      version = "2.0.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/which-module/-/which-module-2.0.1.tgz";
        sha512 = "iBdZ57RDvnOR9AGBhML2vFZf7h8vmBjhoaZqODJBFWHVtKkDmKuHai3cx5PgVMrX5YDNp27AofYbAwctSS+vhQ==";
      };
    };
    "wrap-ansi-5.1.0" = {
      name = "wrap-ansi";
      packageName = "wrap-ansi";
      version = "5.1.0";
      src = fetchurl {
        url = "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-5.1.0.tgz";
        sha512 = "QC1/iN/2/RPVJ5jYK8BGttj5z83LmSKmvbvrXPNCLZSEb32KKVDJDl/MOt2N01qU2H/FkzEa9PKto1BqDjtd7Q==";
      };
    };
    "y18n-4.0.3" = {
      name = "y18n";
      packageName = "y18n";
      version = "4.0.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/y18n/-/y18n-4.0.3.tgz";
        sha512 = "JKhqTOwSrqNA1NY5lSztJ1GrBiUodLMmIZuLiDaMRJ+itFd+ABVE8XBjOvIWL+rSqNDC74LCSFmlb/U4UZ4hJQ==";
      };
    };
    "yargs-14.2.3" = {
      name = "yargs";
      packageName = "yargs";
      version = "14.2.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/yargs/-/yargs-14.2.3.tgz";
        sha512 = "ZbotRWhF+lkjijC/VhmOT9wSgyBQ7+zr13+YLkhfsSiTriYsMzkTUFP18pFhWwBeMa5gUc1MzbhrO6/VB7c9Xg==";
      };
    };
    "yargs-parser-15.0.3" = {
      name = "yargs-parser";
      packageName = "yargs-parser";
      version = "15.0.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/yargs-parser/-/yargs-parser-15.0.3.tgz";
        sha512 = "/MVEVjTXy/cGAjdtQf8dW3V9b97bPN7rNn8ETj6BmAQL7ibC7O1Q9SPJbGjgh3SlwoBNXMzj/ZGIj8mBgl12YA==";
      };
    };
  };
  args = {
    name = "interactive_test";
    packageName = "interactive_test";
    version = "1.0.0";
    src = ./.;
    dependencies = [
      sources."@clr/icons-4.0.16"
      sources."@popperjs/core-2.11.7"
      sources."@types/geojson-7946.0.10"
      sources."@types/leaflet-1.9.3"
      sources."@webcomponents/custom-elements-1.4.3"
      sources."ansi-regex-4.1.1"
      sources."ansi-styles-3.2.1"
      sources."camelcase-5.3.1"
      sources."cliui-5.0.0"
      sources."color-convert-1.9.3"
      sources."color-name-1.1.3"
      sources."complex.js-2.1.1"
      sources."decamelize-1.2.0"
      sources."decimal.js-10.4.3"
      sources."emoji-regex-7.0.3"
      sources."escape-latex-1.2.0"
      sources."find-up-3.0.0"
      sources."fraction.js-4.2.0"
      sources."get-caller-file-2.0.5"
      sources."is-fullwidth-code-point-2.0.0"
      sources."javascript-natural-sort-0.7.1"
      sources."leaflet-1.9.4"
      sources."leaflet-rotate-map-0.2.6"
      sources."locate-path-3.0.0"
      sources."mathjs-8.1.1"
      sources."p-limit-2.3.0"
      sources."p-locate-3.0.0"
      sources."p-try-2.2.0"
      sources."p5-1.6.0"
      sources."path-exists-3.0.0"
      sources."require-directory-2.1.1"
      sources."require-main-filename-2.0.0"
      sources."seedrandom-3.0.5"
      sources."set-blocking-2.0.0"
      sources."showdown-1.9.1"
      sources."showdown-htmlescape-0.1.9"
      sources."string-width-3.1.0"
      sources."strip-ansi-5.2.0"
      sources."tiny-emitter-2.1.0"
      sources."tippy.js-6.3.7"
      sources."typed-function-2.1.0"
      sources."which-module-2.0.1"
      sources."wrap-ansi-5.1.0"
      sources."y18n-4.0.3"
      sources."yargs-14.2.3"
      sources."yargs-parser-15.0.3"
    ];
    buildInputs = globalBuildInputs;
    meta = {
      description = "";
      license = "ISC";
    };
    production = true;
    bypassCache = true;
    reconstructLock = true;
  };
in
{
  args = args;
  sources = sources;
  tarball = nodeEnv.buildNodeSourceDist args;
  package = nodeEnv.buildNodePackage args;
  shell = nodeEnv.buildNodeShell args;
  nodeDependencies = nodeEnv.buildNodeDependencies (lib.overrideExisting args {
    src = stdenv.mkDerivation {
      name = args.name + "-package-json";
      src = nix-gitignore.gitignoreSourcePure [
        "*"
        "!package.json"
        "!package-lock.json"
      ] args.src;
      dontBuild = true;
      installPhase = "mkdir -p $out; cp -r ./* $out;";
    };
  });
}
