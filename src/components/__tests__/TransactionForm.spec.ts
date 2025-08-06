import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import TransactionForm from "../TransactionForm.vue";
import { categories_mock } from "./__mocks__/categories";
import API from "../../api";
import { DialogService, ToastService } from "primevue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

const dialogRefMock = {
  value: {
    close: vi.fn(),
  },
};

let wrapper: VueWrapper;

const mountAPI = () => {
  vi.mock("../../api", () => ({
    default: {
      get: vi.fn((url: string) => {
        if (url === "/categories") {
          return Promise.resolve({ data: categories_mock });
        }
      }),
      post: vi.fn((url: string, data: any) => {
        if (url === "/transactions/add")
          return Promise.resolve({
            data: { message: "Transaction added", id: 1 },
          });
        else if (url === "/categories/add")
          return Promise.resolve({
            data: {
              id: 1,
              name: data.name,
              icon: data.icon,
              is_default: data.is_default,
            },
          });
      }),
    },
  }));
};

const mountWrapper = () => {
  return mount(TransactionForm, {
    global: {
      plugins: [
        ToastService,
        DialogService,
        createTestingPinia({
          stubActions: false,
          createSpy: vi.fn,
        }),
      ],
      provide: {
        dialogRef: dialogRefMock,
      },
      directives: {
        keyfilter: {
          mounted: vi.fn(),
          beforeUpdate: vi.fn(),
        },
      },
    },
  });
};

describe("TransactionForm.vue", () => {
  beforeEach(() => {
    mountAPI();
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it("should render form inputs", () => {
    wrapper = mountWrapper();
    expect(wrapper.find('[test-suite="amount"]').exists()).toBe(true);
    expect(wrapper.find('[test-suite="select-type"]').exists()).toBe(true);
    expect(wrapper.find('[test-suite="select-categories"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[test-suite="input-description"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[test-suite="add-new-category"]').exists()).toBe(true);
    expect(wrapper.find('[test-suite="transaction-submit"]').exists()).toBe(
      true
    );
  });

  it("should render hidden new category inputs after clicking add new category", async () => {
    wrapper = mountWrapper();
    const addCategoryBtn = wrapper.find('[test-suite="add-new-category"]');
    await addCategoryBtn.trigger("click");
    expect(wrapper.find('[test-suite="input-new-category"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[test-suite="submit-new-category"]').exists()).toBe(
      true
    );
    await addCategoryBtn.trigger("click");
  });

  it("should not render hidden new category inputs before clicking add new category", () => {
    wrapper = mountWrapper();
    expect(wrapper.find('[test-suite="input-new-category"]').exists()).toBe(
      false
    );
    expect(wrapper.find('[test-suite="submit-new-category"]').exists()).toBe(
      false
    );
  });

  it("should fetch categories on mount", async () => {
    wrapper = mountWrapper();
    await flushPromises();
    expect(API.get).toHaveBeenCalledWith("/categories");
    const selectCategories = wrapper.find('[test-suite="select-categories"]');
    await selectCategories.trigger("click");
    const options = Array.from(
      document.querySelectorAll(".p-select-option-label")
    );
    expect(options.length).toBeGreaterThan(0);
    categories_mock.forEach((cat) => {
      expect(options.some((o) => o.textContent?.includes(cat.name))).toBe(true);
    });
  });

  it("should submit an income transaction", async () => {
    wrapper = mountWrapper();
    mountAPI();
    await flushPromises();
    (wrapper.vm as any).form.amount = 5000;
    (wrapper.vm as any).form.category = "Paycheck";
    (wrapper.vm as any).form.description = "Monthly Payment";
    (wrapper.vm as any).form.type = "income";
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(API.get).toHaveBeenCalledWith("/categories");
    expect(API.post).toHaveBeenCalledWith("/transactions/add", {
      type: "income",
      amount: 5000,
      description: "Monthly Payment",
      category: "Paycheck",
    });
  });

  it("should submit an expense transaction", async () => {
    wrapper = mountWrapper();
    mountAPI();
    await flushPromises();
    (wrapper.vm as any).form.amount = 1000;
    (wrapper.vm as any).form.category = "Rent";
    (wrapper.vm as any).form.description = "Monthly Rent";
    (wrapper.vm as any).form.type = "expense";
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(API.get).toHaveBeenCalledWith("/categories");
    expect(API.post).toHaveBeenCalledWith("/transactions/add", {
      type: "expense",
      amount: 1000,
      description: "Monthly Rent",
      category: "Rent",
    });
  });

  it("should not submit if type is missing", async () => {
    wrapper = mountWrapper();
    await flushPromises();
    (wrapper.vm as any).form.category = "Rent";
    (wrapper.vm as any).form.description = "Monthly Rent";
    (wrapper.vm as any).form.amount = 1000;
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(API.post).not.toHaveBeenCalled();
  });

  it("should not submit if description is missing", async () => {
    wrapper = mountWrapper();
    await flushPromises();

    (wrapper.vm as any).form.amount = 1000;
    (wrapper.vm as any).form.category = "Rent";
    (wrapper.vm as any).form.type = "expense";
    (wrapper.vm as any).form.description = ""; // Missing

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(API.post).not.toHaveBeenCalled();
  });

  it("should not submit if category is missing", async () => {
    wrapper = mountWrapper();
    await flushPromises();
    (wrapper.vm as any).form.description = "Monthly Rent";
    (wrapper.vm as any).form.type = "expense";
    (wrapper.vm as any).form.amount = 1000;
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(API.post).not.toHaveBeenCalled();
  });

  it("should not submit if amount <= 0", async () => {
    wrapper = mountWrapper();
    await flushPromises();
    (wrapper.vm as any).form.amount = 0;
    (wrapper.vm as any).form.category = "Rent";
    (wrapper.vm as any).form.description = "Monthly Rent";
    (wrapper.vm as any).form.type = "expense";
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(API.post).not.toHaveBeenCalled();
  });

  it("should submit new category", async () => {
    wrapper = mountWrapper();
    await flushPromises();
    expect(API.get).toHaveBeenCalledWith("/categories");
    const addCategoryBtn = wrapper.find('[test-suite="add-new-category"]');
    await addCategoryBtn.trigger("click");
    await wrapper
      .find('[test-suite="input-new-category"]')
      .setValue("New test category");
    await wrapper.find('[test-suite="submit-new-category"]').trigger("click");
    expect(API.post).toHaveBeenCalledWith("/categories/add", {
      name: "New test category",
      icon: "📝",
      is_default: false,
    });
  });
});
