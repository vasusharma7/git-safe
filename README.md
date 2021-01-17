# git-safe

## Add this to package.json
`
"husky": {
       "hooks": {
         "pre-commit": "git-safe commit",
         "post-checkout": "git-safe decrypt",
         "post-merge": "git-safe decrypt"
       }
     }
`
