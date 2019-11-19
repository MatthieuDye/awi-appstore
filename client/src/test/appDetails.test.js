import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import AppDetails from '../Components/AppDetails'
import { mount } from 'enzyme';
import Enzyme from 'enzyme'
import {Table} from "reactstrap";
Enzyme.configure({ adapter: new Adapter() })

describe('matching cities to foods', () => {
    const item = { id_app: 1, name_app:'lapinApp',name_user: 'lapin',description_app:'my first lapin app',rating:2.5};
    const id_user=2;
    const editAppClick = jest.fn();
    const deleteAppClick = jest.fn();
    const wrapper = mount(
        <table><thead><tr><th>Name</th><th>Developed by</th><th>Rating</th></tr></thead>
            <tbody>
            <AppDetails key={item.id_app} item={item} id_user={id_user} editApp={editAppClick} deleteApp={deleteAppClick} />
            </tbody>
        </table>
    );

    test('name_app', () => {
        const id_app_text = wrapper.find('.name_app');
        expect(id_app_text.text()).toBe('lapinApp');

    });
    test('name_creator', () => {
        const name_creator_text = wrapper.find('.name_creator');
        expect(name_creator_text.text()).toBe('lapin');

    });
    test('click on delete app',() => {
        const delete_app_btn = wrapper.find('.deleteApp').first()
        delete_app_btn.simulate('click')
        expect(deleteAppClick).toBeCalledWith(1)
    })
    test('add app to dashBoard button should not exists because addAppToDashBoard props not given',() => {
        const add_app_btn = wrapper.find('.add')
        expect(wrapper.find('.add').exists()).not.toBeTruthy
    })
});