import { flushPromises, mount } from "@vue/test-utils";
import TransactionForm from "../TransactionForm.vue";
import { categories_mock } from "./__mocks__/categories";
import API from "../../api";
import { Button, InputNumber, InputText, Select } from "primevue";
import PrimeVue from 'primevue/config'



vi.mock('../../api',()=>({
    default:{
        get:vi.fn((url:string)=> {
            if(url === '/categories'){
                return Promise.resolve({data:categories_mock})
            }
        }),
        post:vi.fn((url:string, data:any)=>{
            console.log('url',url)
            if(url === '/transactions/add')
                return Promise.resolve({data:{message: 'Transaction added', id: 1}})
            else if(url=== '/categories/add')
                return Promise.resolve({data:{
                    id:1,
                    name:data.name,
                    icon: data.icon,
                    is_default:data.is_default
                }})
        })
    }
}))   

const wrapper = mount(TransactionForm, {
  global: {
    plugins: [PrimeVue],
    components: {InputText,InputNumber,Button,Select}
  }
});

describe('TransactionForm.vue',()=>{
    it('should render forms inputs ',async ()=>{
        expect(wrapper.find('[test-suite="amount"]').exists()).toBe(true);
        expect(wrapper.find('[test-suite="select-type"]').exists()).toBe(true);
        expect(wrapper.find('[test-suite="select-categories"]').exists()).toBe(true);
        expect(wrapper.find('[test-suite="input-description"]').exists()).toBe(true);
        expect(wrapper.find('[test-suite="add-new-category"]').exists()).toBe(true);
        expect(wrapper.find('[test-suite="transaction-submit"]').exists()).toBe(true);
    });

    it('should render hidden new category inputs after clicking add new category',async ()=>{
        const wrapper = mount(TransactionForm);
        const add_category_button = wrapper.find('[test-suite="add-new-category"]');
        await add_category_button.trigger('click');
        expect(wrapper.find('[test-suite="input-new-category"]').exists()).toBe(true);
        expect(wrapper.find('[test-suite="submit-new-category"]').exists()).toBe(true);
    })

    it('should not render hidden new category inputs before clicking add new category',async ()=>{
        const wrapper = mount(TransactionForm);
        expect(wrapper.find('[test-suite="input-new-category"]').exists()).toBe(false);
        expect(wrapper.find('[test-suite="submit-new-category"]').exists()).toBe(false);
    })

    it('should fetch categories on mount', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        expect(API.get).toHaveBeenCalledWith('/categories');
        const select_categories = wrapper.find('[test-suite="select-categories"]');
        await select_categories.trigger('click');
        const options = Array.from(document.querySelectorAll('.p-select-option-label'));
        expect(options.length).toBeGreaterThan(0);
        categories_mock.forEach((cat)=>{
          expect(options.some((o) => o.textContent?.includes(cat.name))).toBe(true);
        });
    });

    it('should submit an income transaction', async()=>{
        const wrapper = mount(TransactionForm);
        const options = Array.from(document.querySelectorAll('.p-select-item'));

        await flushPromises();
        expect(API.get).toHaveBeenCalledWith('/categories');
        wrapper.find('[test-suite="select-type"]').setValue('income');
        wrapper.find('[test-suite="amount"]').setValue(5000);
        const selectTrigger = wrapper.find('[test-suite="select-categories"]');
        await selectTrigger.trigger('click');
        await flushPromises();
        const groceriesPaycheck= options.find(opt =>
        opt.textContent?.includes('Paycheck')
        );
        expect(groceriesPaycheck).toBeTruthy();
        (groceriesPaycheck as HTMLElement).click();
        expect(groceriesPaycheck).toBeTruthy();
        (groceriesPaycheck as HTMLElement).click();
        // wrapper.find('[test-suite="select-categories"]').setValue('Paycheck');
        wrapper.find('[test-suite="input-description"]').setValue('Monthly Payment');
        await wrapper.find('form').trigger('submit');
        await flushPromises();
        expect(API.post).toHaveBeenCalledWith('/transactions/add',{
            type: "income",
            amount:5000,
            description:'Monthly Payment',
            category: 'Paycheck'
        });

    });

    it('should submit new category', async()=>{
    const wrapper = mount(TransactionForm);
    await flushPromises();
    expect(API.get).toHaveBeenCalledWith('/categories');
    const add_category_button = wrapper.find('button[test-suite="button-new-category"]');
    await add_category_button.trigger('click');
    await wrapper.find('[test-suite="input-new-category"]').setValue('New test category')
    await wrapper.find('[test-suite="submit-new-category"]').trigger('click');
        expect(API.post).toBeCalledTimes(2)
        expect(API.post).toHaveBeenCalledWith('/categories/add',{
            name:"New test category",
            icon:"📝",
            is_default:false
        });
    })
})

