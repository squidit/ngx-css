module.exports = {
  "root": true,
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "ignorePatterns": ["*.spec.*", ".eslintrc.js", "karma.conf.js", "protractor.conf.js", "tsconfig.*", "tslint.*", "webpack.*", "node_modules/"],
  "overrides": [
    {
      "files": ["*.ts", "*.js"],
      "parserOptions": {
        "project": ["tsconfig.json"],
        "tsconfigRootDir": __dirname,
        "sourceType": "module",
        "createDefaultProgram": true
      },
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "no-underscore-dangle": "off",
        "no-prototype-builtins": "off",
        "semi": [2, "always"],
        "arrow-body-style": ["off"],
        "@typescript-eslint/semi": [2, "always"],
        "@typescript-eslint/ban-types": ["off"],
        "@typescriot-eslint/experimental-decorators": ["off"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/member-delimiter-style": ["off"],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "kebab-case"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "camelCase"
          }
        ],
        // Regra para desencorajar constructor injection em favor de inject()
        "no-restricted-syntax": [
          "warn",
          {
            "selector": "MethodDefinition[kind='constructor'] Parameter[decorators.length > 0]",
            "message": "⚠️  Constructor parameters with decorators (@Inject, @Optional, etc.) are discouraged. Consider using inject() function for better tree-shaking and modern Angular practices."
          },
          {
            "selector": "MethodDefinition[kind='constructor'][value.params.length > 0]:not(:has(Parameter[decorators.length > 0]))",
            "message": "⚠️  Constructor dependency injection is discouraged. Consider using inject() function for better tree-shaking and modern Angular practices."
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {
        // Regra para desencorajar uso de *ngIf e *ngFor em favor da nova sintaxe @if/@for
        "@angular-eslint/template/no-any": "off",
        "@angular-eslint/template/prefer-control-flow": "error"
      }
    }
  ]
}
