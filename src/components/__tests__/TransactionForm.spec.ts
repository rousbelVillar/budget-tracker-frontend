import { flushPromises, mount } from "@vue/test-utils";
import TransactionForm from "../TransactionForm.vue";
import { categories_mock } from "./__mocks__/categories";
import API from "../../api";


vi.mock('../../api',()=>({
    default:{
        get:vi.fn((url:string)=> {
            if(url === '/categories'){
                return Promise.resolve({data:categories_mock})
            }
            return Promise.reject(new Error(`Unknown URL: ${url}`))
        })
    }
}))   

describe('TransactionForm.vue',()=>{
    it('should render forms inputs ',async ()=>{
        const wrapper = mount(TransactionForm);
        expect(wrapper.find('input[type="number"]').exists()).toBe(true);
        expect(wrapper.find('select[test-suite="select-type"]').exists()).toBe(true);
        expect(wrapper.find('select[test-suite="select-categories"]').exists()).toBe(true);
        expect(wrapper.find('input[test-suite="input-description"]').exists()).toBe(true);
        expect(wrapper.find('button[test-suite="button-new-category"]').exists()).toBe(true);
        expect(wrapper.find('button[test-suite="transaction-submit"]').exists()).toBe(true);
    });

    it('should render hidden new category inputs after clicking add new category',async ()=>{
        const wrapper = mount(TransactionForm);
        const add_category_button = wrapper.find('button[test-suite="button-new-category"]');
        await add_category_button.trigger('click');
        expect(wrapper.find('input[test-suite="input-new-category"]').exists()).toBe(true);
        expect(wrapper.find('button[test-suite="submit-new-category"]').exists()).toBe(true);
    })

    it('should not render hidden new category inputs before clicking add new category',async ()=>{
        const wrapper = mount(TransactionForm);
        expect(wrapper.find('input[test-suite="input-new-category"]').exists()).toBe(false);
        expect(wrapper.find('button[test-suite="submit-new-category"]').exists()).toBe(false);
    })

    it('should fetch categories on mount', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        expect(API.get).toHaveBeenCalledWith('/categories');
        const options = wrapper.findAll('option[test-suite="category-option"]');
        categories_mock.forEach((cat)=>{
            expect(options.some(o => o.text().includes(cat.name))).toBe(true);
        });
    })
})

