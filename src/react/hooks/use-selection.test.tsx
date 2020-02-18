import React from 'react';
import { render } from '@testing-library/react';

test('hello world with react testing library ', () => {
    const { getByText } = render(<div>marker</div>);
    expect(getByText('marker')).toBeInTheDocument();
});
