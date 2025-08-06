import { mount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import TransactionList from "../TransactionList.vue";
import API from "../../api";

vi.mock("@/api", () => ({
  default: {
    delete: vi.fn(() => Promise.resolve()),
  },
}));

const confirmMock = { require: vi.fn() };
const toastMock = { add: vi.fn() };

vi.mock("primevue/useconfirm", () => ({
  useConfirm: () => confirmMock,
}));

vi.mock("primevue/usetoast", () => ({
  useToast: () => toastMock,
}));

const sampleTransaction = {
  id: 123,
  type: "expense",
  category: "Food",
  description: "Lunch",
  amount: 1500,
  date: "2025-07-08",
};

let wrapper: VueWrapper;
const fetchTransactions = vi.fn();

interface MountOpts {
  empty?: boolean;
  rows?: any[];
}

const mountComponent = (opts: MountOpts = {}) => {
  const rows = opts.rows ?? (opts.empty ? [] : [sampleTransaction]);
  wrapper = mount(TransactionList, {
    global: {
      plugins: [
        createTestingPinia({
          stubActions: false,
          createSpy: () => fetchTransactions,
          initialState: {
            transactions: { transactions: rows },
            dashboard: {
              selectedMonth: "2025-07",
            },
          },
        }),
        ConfirmationService,
        ToastService,
      ],
    },
  });
};

describe("TransactionList.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mountComponent();
  });

  it("calls fetchTransactions on mount", () => {
    expect(fetchTransactions).toHaveBeenCalledWith("2025-07");
  });

  it("renders transaction content when transactions exist", async () => {
    await wrapper.vm.$nextTick();
    const html = wrapper.html();
    expect(html).toContain("expense");
    expect(html).toContain("Food");
    expect(html).toContain("Lunch");
  });

  it("displays formatted currency", async () => {
    await wrapper.vm.$nextTick();
    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(1);
    const amountCellText = rows[0].findAll("td")[3].text();
    expect(amountCellText).toBe("$1,500.00");
  });

  it("renders tag with correct type severity", async () => {
    await wrapper.vm.$nextTick();
    const tag = wrapper.findComponent({ name: "Tag" });
    expect(tag.exists()).toBe(true);
    expect(tag.props("value")).toBe("expense");
    expect(tag.props("severity")).toBe("warn");
  });

  it('displays "No transactions yet." when list is empty', async () => {
    mountComponent({ empty: true });
    await wrapper.vm.$nextTick();
    const empty = await wrapper.find('[test-suite="no-transactions-message"]');
    expect(empty.exists()).toBe(true);
    expect(empty.text()).toContain("No transactions yet");
  });

  it("triggers confirm dialog and deletes a row on accept", async () => {
    await wrapper.vm.$nextTick();
    const removeButton = wrapper.find('[test-suite="cancel-new-category"]');
    expect(removeButton.exists()).toBe(true);
    await removeButton.trigger("click");
    setTimeout(async () => {
      expect(confirmMock.require).toHaveBeenCalledTimes(1);
      const confirmArgs = confirmMock.require.mock.calls[0][0];
      await confirmArgs.accept();
      expect(API.delete).toHaveBeenCalledWith("/transactions/123");
      expect(fetchTransactions).toHaveBeenCalledWith("2025-07");
      expect(toastMock.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "info",
          summary: "Confirmed",
          detail: "Record deleted",
        })
      );
    }, 1000);
  });

  it("does not render invalid amounts", async () => {
    const badRows = [
      { ...sampleTransaction, id: 201, amount: null },
      { ...sampleTransaction, id: 202, amount: NaN },
      //   { ...sampleTransaction, id: 203, amount: -55 },
    ];
    mountComponent({ rows: badRows });

    await wrapper.vm.$nextTick();
    const amountCells = wrapper.findAll("tbody tr td:nth-child(4)");
    amountCells.forEach((cell) => {
      expect(cell.text()).toBe("");
    });
  });
});
