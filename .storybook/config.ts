import { configure } from '@storybook/react'

// automatically import all files ending in *.stories.(tsx|jsx)
let req = require.context('../src', true, /\.stories\.tsx$/)

configure(req, module)
