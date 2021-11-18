import { storiesOf } from '@storybook/react'
import React from 'react'
import { Hide } from './Hide'

export default {
  title: 'Hide',
  component: Hide,
}

storiesOf('Hide', module)
  .add('visible', () => <Hide hide={false}>Hello Button</Hide>)
  .add('hidden', () => <Hide hide={true}>Hello Button</Hide>)
