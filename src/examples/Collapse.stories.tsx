import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Collapse } from './Collapse'

export default {
  title: 'Collapse',
  component: Collapse,
}

const actions = {
  onCollapse: action('onCollapse'),
  onExpand: action('onExpand'),
}

storiesOf('Collapse', module)
  .add('default is collapsed ', () => <Collapse {...actions}>Hello Button</Collapse>)
  .add('initially explicitly collapsed', () => (
    <Collapse expand={false} {...actions}>
      Hello Button
    </Collapse>
  ))
  .add('initially expanded', () => (
    <Collapse expand={true} {...actions}>
      Hello Button
    </Collapse>
  ))
