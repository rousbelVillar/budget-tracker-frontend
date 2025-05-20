import { mount } from "@vue/test-utils";
import TransactionForm from "../TransactionForm.vue";
import API from "../../api";

vi.mock('../../api',()=>({
    default:{
        get:vi.fn(()=> Promise.resolve({data:[]}))
    }
}))

describe('TransactionForm.vue',()=>{
    it('Renders forms inputs ',async ()=>{
        const wrapper = mount(TransactionForm);
        expect(wrapper.find('input[type="number"]').exists()).toBe(true)
        expect(wrapper.find('select').exists()).toBe(true)

    })
})