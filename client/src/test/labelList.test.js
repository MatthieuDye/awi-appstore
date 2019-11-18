import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import LabelList from '../Components/LabelList'

import { mount } from 'enzyme';
import Enzyme from 'enzyme'
Enzyme.configure({ adapter: new Adapter() })

test('LabelList component should return labels given in props', () => {
    const items = [{ id_label: 1, name_label: 'sport'},{ id_label: 2, name_label: 'informatique' }];
    const wrapper = mount(
        <LabelList items={items} />
    );
    const p = wrapper.find('.labelsList');
    expect(p.text()).toBe('sportinformatique');

});