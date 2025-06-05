import { flushPromises, mount } from "@vue/test-utils";
import TransactionForm from "../TransactionForm.vue";
import { categories_mock } from "./__mocks__/categories";
import API from "../../api";
import { mockTransactionResolver, transactionFormResolver } from "../../validation/resolvers";

    describe('TransactionForm.vue',()=>{
        beforeEach(()=>{
            vi.clearAllMocks()
            vi.mock('../../api',()=>({
            default:{
                get:vi.fn((url:string)=> {
                    if(url === '/categories'){
                        return Promise.resolve({data:categories_mock})
                    }
                }),
                post:vi.fn((url:string, data:any)=>{
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
        });
    it('should render forms inputs ',async ()=>{
        const wrapper = mount(TransactionForm);
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
        await add_category_button.trigger('click');//hiding it back
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
        await flushPromises();
        (wrapper.vm as any).form.amount = 5000;
        (wrapper.vm as any).form.category = "Paycheck";     
        (wrapper.vm as any).form.description = "Monthly Payment";
        (wrapper.vm as any).form.type = "income";
        (wrapper.vm as any).test = true;
        await wrapper.find('form').trigger('submit.prevent');
        expect(API.get).toHaveBeenCalledWith('/categories');
        await flushPromises();
        expect(API.post).toBeCalledTimes(1);
        expect(API.post).toHaveBeenCalledWith('/transactions/add',{
            type: 'income',
            amount:5000,
            description:'Monthly Payment',
            category: 'Paycheck'
        });
        await flushPromises();
        wrapper.unmount()
    });

    it('should submit an expense transaction', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        (wrapper.vm as any).form.amount = 1000;
        (wrapper.vm as any).form.category = "Rent";     
        (wrapper.vm as any).form.description = "Monthly Rent";
        (wrapper.vm as any).form.type = "expense";
        await wrapper.find('form').trigger('submit.prevent');
        expect(API.get).toHaveBeenCalledWith('/categories');
        await flushPromises();
        expect(API.post).toBeCalledTimes(1);
        expect(API.post).toHaveBeenCalledWith('/transactions/add',{
            type: 'expense',
            amount:1000,
            description:'Monthly Rent',
            category: 'Rent'
        });
        wrapper.unmount()
    });

    it('should not submit if type is missing.', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        (wrapper.vm as any).form.category = "Rent";
        (wrapper.vm as any).form.description = "Monthly Rent";
        (wrapper.vm as any).form.amount = 1000;
        await wrapper.find('form').trigger('submit.prevent');
        expect(API.get).toHaveBeenCalledWith('/categories');
        await flushPromises();
        expect(API.post).toBeCalledTimes(0);
        wrapper.unmount()
    });

    it('should not submit if description is missing.', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        (wrapper.vm as any).form.amount = 1000;
        (wrapper.vm as any).form.category = "Rent";     
        (wrapper.vm as any).form.type = "expense";
        await wrapper.find('form').trigger('submit.prevent');
        expect(API.get).toHaveBeenCalledWith('/categories');
        await flushPromises();
        expect(API.post).toBeCalledTimes(0);
        wrapper.unmount()
    });

    it('should not submit if category is missing.', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        (wrapper.vm as any).form.description = "Monthly Rent";
        (wrapper.vm as any).form.type = "expense";
        (wrapper.vm as any).form.amount = 1000;
        await wrapper.find('form').trigger('submit.prevent');
        expect(API.get).toHaveBeenCalledWith('/categories');
        await flushPromises();
        expect(API.post).toBeCalledTimes(0);
        wrapper.unmount()
    });

    it('should not submit if amount <=0.', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        (wrapper.vm as any).form.amount = 0;
        (wrapper.vm as any).form.category = "Rent";     
        (wrapper.vm as any).form.description = "Monthly Rent";
        (wrapper.vm as any).form.type = "expense";
        await wrapper.find('form').trigger('submit.prevent');
        expect(API.get).toHaveBeenCalledWith('/categories');
        await flushPromises();
        expect(API.post).toBeCalledTimes(0);
        wrapper.unmount()
    });

    it('should submit new category', async()=>{
        const wrapper = mount(TransactionForm);
        await flushPromises();
        expect(API.get).toHaveBeenCalledWith('/categories');
        const add_category_button = wrapper.find('[test-suite="add-new-category"]');
        await add_category_button.trigger('click');
        await wrapper.find('[test-suite="input-new-category"]').setValue('New test category')
        await wrapper.find('[test-suite="submit-new-category"]').trigger('click');
            expect(API.post).toBeCalledTimes(1)
            expect(API.post).toHaveBeenCalledWith('/categories/add',{
                name:"New test category",
                icon:"📝",
                is_default:false
            });
    })
})

