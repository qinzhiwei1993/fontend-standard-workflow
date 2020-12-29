// Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
// Applicable always|never: never inverts the rule.
// Value: value to use for this rule.

module.exports = {
    extends: ['@commitlint/config-conventional'], // 基于@commitlint/config-conventional扩展
    // parserPreset: 'conventional-changelog-conventionalcommits', // commit信息的格式解析器
    rules: {
        'scope-empty': [0], // scope非必填
        'subject-case': [
            2,
            'always',
            [
                'lower-case', // default
                'upper-case', // UPPERCASE
                'camel-case', // camelCase
                'kebab-case', // kebab-case
                'pascal-case', // PascalCase
                'sentence-case', // Sentence case
                'snake-case', // snake_case
                'start-case', // Start Case
            ],
        ],
        'subject-full-stop': [2, 'never', '.'], 
        'type-enum': [
            2,
            'always',
            [
                'build',
                'ci',
                'chore',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test'
            ]
        ]
    },
}