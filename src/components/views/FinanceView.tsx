import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { ExpenseItem } from '../../types';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Plus,
  SlidersHorizontal,
  Download,
  Search,
  Check,
  X,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    finance,
    setCurrency,
    openAddModal,
    deleteTransaction,
    editTransaction,
    updateFinanceBudget,
  } = useLifeOS();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Transaction Edit Modal state
  const [editingTx, setEditingTx] = useState<ExpenseItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseItem['category']>('Food');

  // Budget Modal state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempIncome, setTempIncome] = useState(String(finance.monthlyIncome || 250000));
  const [tempBudget, setTempBudget] = useState(String(finance.monthlyBudget || 175000));

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const currentCurrency = finance.currency || 'Rs.';

  const displayIncome = finance.monthlyIncome || 250000;
  const displayExpenses = finance.monthlyExpenses || 148500;
  const displayBudget = finance.monthlyBudget || 175000;
  const displaySavings = Math.max(0, displayIncome - displayExpenses);
  const savingsRate = displayIncome > 0
    ? Math.round((displaySavings / displayIncome) * 100)
    : 40.6;
  const burnRate = displayIncome > 0
    ? ((displayExpenses / displayIncome) * 100).toFixed(1)
    : '59.4';
  const budgetConsumedPct = displayBudget > 0
    ? Math.min(100, Math.round((displayExpenses / displayBudget) * 100))
    : 84.8;
  const budgetRunway = Math.max(0, displayBudget - displayExpenses);

  // Default rich prototype transactions if empty
  const defaultTransactions: (ExpenseItem & { method?: string })[] = [
    {
      id: 'tx-1',
      title: 'Equinox Fitness Membership',
      amount: 8500,
      category: 'Health' as any,
      date: 'Oct 24, 2026',
      method: 'Card Rail',
    },
    {
      id: 'tx-2',
      title: 'Whole Foods Market',
      amount: 4200,
      category: 'Food',
      date: 'Oct 23, 2026',
      method: 'UPI / Direct',
    },
    {
      id: 'tx-3',
      title: 'Client Retainer Payout',
      amount: -125000,
      category: 'Other',
      date: 'Oct 22, 2026',
      method: 'Wire Transfer',
    },
    {
      id: 'tx-4',
      title: 'Apple Cloud & SaaS Subscriptions',
      amount: 1890,
      category: 'Bills',
      date: 'Oct 21, 2026',
      method: 'Auto Debit',
    },
    {
      id: 'tx-5',
      title: 'Shell Fuel Station',
      amount: 3400,
      category: 'Transport',
      date: 'Oct 20, 2026',
      method: 'Card Rail',
    },
    {
      id: 'tx-6',
      title: 'Nike Running Footwear Store',
      amount: 14500,
      category: 'Shopping',
      date: 'Oct 19, 2026',
      method: 'POS Terminal',
    },
  ];

  const transactionList =
    finance.recentTransactions && finance.recentTransactions.length > 0
      ? finance.recentTransactions
      : defaultTransactions;

  // Filtered transactions
  const filteredTransactions = transactionList.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'INCOME') return tx.amount < 0 || tx.category === 'Other';
    if (activeFilter === 'EXPENSES') return tx.amount > 0;
    if (activeFilter === 'FIXED') return tx.category === 'Bills';
    if (activeFilter === 'DISCRETIONARY') return tx.category === 'Shopping' || tx.category === 'Food';
    return true;
  });

  const handleExportStatement = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Date,Title,Category,Amount\n' +
      transactionList
        .map((t) => `"${t.date}","${t.title}","${t.category}","${t.amount}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LifeOS_Capital_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Capital Ledger Statement Exported (.CSV)');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = parseFloat(tempIncome) || 0;
    const bud = parseFloat(tempBudget) || 0;
    updateFinanceBudget(inc, bud);
    setIsBudgetModalOpen(false);
    showToast('Monthly Cash Flow Envelope Parameters Updated');
  };

  const handleOpenEdit = (tx: ExpenseItem) => {
    setEditingTx(tx);
    setEditTitle(tx.title);
    setEditAmount(String(Math.abs(tx.amount)));
    setEditCategory(tx.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    const num = parseFloat(editAmount);
    if (isNaN(num) || num <= 0) return;

    editTransaction(editingTx.id, {
      title: editTitle.trim() || editingTx.title,
      amount: editingTx.amount < 0 ? -num : num,
      category: editCategory,
    });
    setEditingTx(null);
    showToast('Ledger Record Updated');
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-[1600px] mx-auto text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C5FF00] text-[#0A0A0A] px-4 py-2.5 rounded-sm shadow-2xl font-['Space_Grotesk'] text-xs font-bold flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-[#0A0A0A] stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Command Ribbon */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#C5FF00] shadow-[0_0_10px_#C5FF00] animate-pulse" />
            <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest text-[#C5FF00] font-bold">
              CAPITAL & CASH FLOW • OCTOBER 2026
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Capital & Cash Flow
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#C8C6C5] max-w-2xl leading-relaxed">
            Real-time liquidity monitoring, capital burn rates, category envelopes, and predictive runway models.
          </p>
        </div>

        {/* Currency Switcher & Rapid Tactical Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Toggle */}
          <div className="flex items-center bg-[#1C1B1B] border border-[#2A2A2A] p-0.5 rounded-sm">
            {['Rs.', '$', '€', '£'].map((curr) => {
              const isSelected = currentCurrency === curr;
              return (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 font-['Space_Grotesk'] text-xs font-mono rounded-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#201F1F] text-[#C5FF00] font-bold border border-[#C5FF00]/40'
                      : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1B1B] hover:bg-[#201F1F] text-white transition-all rounded-sm border border-[#2A2A2A] shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C5FF00]" />
            <span className="font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider">
              Set Monthly Budget
            </span>
          </button>

          <button
            onClick={handleExportStatement}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1B1B] hover:bg-[#201F1F] text-white transition-all rounded-sm border border-[#2A2A2A] shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C5FF00]" />
            <span className="font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider">
              Export Statement
            </span>
          </button>

          <button
            onClick={() => openAddModal('finance')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </section>

      {/* 2. Four Monolith Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Inflow */}
        <div className="flex flex-col bg-[#0E0E0E] p-5 rounded-sm border border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
              MONTHLY INFLOW
            </span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
              +18.4% MoM
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
              {currentCurrency} {displayIncome.toLocaleString()}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8E8E93] mt-1">
            Salary 200k + Dividends 50k
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[100%] rounded-full" />
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="flex flex-col bg-[#0E0E0E] p-5 rounded-sm border border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
              TOTAL EXPENSES
            </span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C8C6C5] font-bold">
              {burnRate}% Burn
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
              {currentCurrency} {displayExpenses.toLocaleString()}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8E8E93] mt-1">
            Paced: {currentCurrency} 6,187 / day average
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[59.4%] rounded-full" />
          </div>
        </div>

        {/* Card 3: Net Capital Surplus */}
        <div className="flex flex-col bg-[#0E0E0E] p-5 rounded-sm border border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
              NET CAPITAL SURPLUS
            </span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
              {savingsRate}% Savings Rate
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-[#C5FF00]">
              {currentCurrency} {displaySavings.toLocaleString()}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8E8E93] mt-1">
            Exceeds 35% target delta
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[78%] rounded-full" />
          </div>
        </div>

        {/* Card 4: Budget Envelope */}
        <div className="flex flex-col bg-[#0E0E0E] p-5 rounded-sm border border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
              BUDGET ENVELOPE
            </span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-white font-bold">
              {budgetConsumedPct}%
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-white">
              {currentCurrency} {displayExpenses.toLocaleString()}
            </span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8E8E93]">
              / {displayBudget.toLocaleString()}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] mt-1 font-bold">
            {currentCurrency} {budgetRunway.toLocaleString()} runway buffer
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[84.8%] rounded-full" />
          </div>
        </div>
      </section>

      {/* 3. Split 7/5 Grid: Category Allocations & Smart Bridge */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Category Allocations */}
        <div className="lg:col-span-7 bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]/60">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-wider font-bold">
                  Expenditure Vectors
                </span>
                <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                  Category Allocations & Envelopes
                </h2>
              </div>
              <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
                5 ACTIVE VECTORS
              </span>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
              {/* Category 1: Bills & Utilities */}
              <div className="p-3 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-rose-400" />
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-white">
                      Bills & Fixed Commitments
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-white">
                      {currentCurrency} 65,000
                    </span>
                    <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                      / 65,000 (100%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-sm" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#8E8E93]">
                  <span>Rent, utilities, cloud retainers</span>
                  <span className="text-white font-mono font-bold">LOCKED FOR MONTH</span>
                </div>
              </div>

              {/* Category 2: Food & Nutrition */}
              <div className="p-3 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-white">
                      Food & High-Performance Nutrition
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-white">
                      {currentCurrency} 38,000
                    </span>
                    <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                      / 42,000 (90.4%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-sm" style={{ width: '90.4%' }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#8E8E93]">
                  <span>Groceries, prep kitchens, organic fuel</span>
                  <span className="text-[#C5FF00] font-mono font-bold">
                    {currentCurrency} 4,000 remaining
                  </span>
                </div>
              </div>

              {/* Category 3: Shopping & Gear */}
              <div className="p-3 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-purple-400" />
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-white">
                      Shopping, Hardware & Gear
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-white">
                      {currentCurrency} 22,000
                    </span>
                    <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                      / 25,000 (88.0%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-sm" style={{ width: '88%' }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#8E8E93]">
                  <span>Athletic gear, electronics, apparel</span>
                  <span className="text-[#C5FF00] font-mono font-bold">
                    {currentCurrency} 3,000 remaining
                  </span>
                </div>
              </div>

              {/* Category 4: Transit & Fuel */}
              <div className="p-3 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-white">
                      Transit, Fuel & Mobility
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-white">
                      {currentCurrency} 14,000
                    </span>
                    <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                      / 18,000 (77.7%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-sm" style={{ width: '77.7%' }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#8E8E93]">
                  <span>Fuel, tolls, ride hail</span>
                  <span className="text-[#C5FF00] font-mono font-bold">
                    {currentCurrency} 4,000 remaining
                  </span>
                </div>
              </div>

              {/* Category 5: Health & Recovery */}
              <div className="p-3 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5FF00]" />
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-white">
                      Health, Longevity & Recovery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-white">
                      {currentCurrency} 9,500
                    </span>
                    <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                      / 10,000 (95.0%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                  <div className="bg-[#C5FF00] h-full rounded-sm" style={{ width: '95%' }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#8E8E93]">
                  <span>Gym pass, massage therapy, sauna</span>
                  <span className="text-[#C5FF00] font-mono font-bold">
                    {currentCurrency} 500 remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-[#2A2A2A]/60 flex items-center justify-between text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">
              RECONCILIATION: 100% VERIFIED ON 5 LEDGERS
            </span>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Adjust Allocations <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Smart Bridge & Liquidity Radar */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Automated Smart Bridge */}
          <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#2A2A2A] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]/60">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                AUTOMATED SMART BRIDGE
              </span>
              <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#C5FF00] bg-[#1C1B1B] px-2 py-0.5 rounded-sm font-bold">
                SCHEDULED OCT 31
              </span>
            </div>

            <div className="p-4 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A] flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-white block">
                    Emergency Reserve Sweep
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8E8E93]">
                    Checking Account → High-Yield Vault (8.2%)
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-[#C5FF00]">
                  {currentCurrency} 25,000
                </span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#C8C6C5] mt-1 leading-relaxed">
                Rules-based liquidity trigger executes on month-end closing, sweeping surplus cash above Rs. 50,000 buffer into your interest-yielding treasury bond vault.
              </p>
              <button
                onClick={() => showToast('Smart Sweep Executed Ahead of Schedule')}
                className="mt-2 w-full py-2 bg-[#201F1F] hover:bg-[#2A2A2A] text-white hover:text-[#C5FF00] border border-[#2A2A2A] font-['Space_Grotesk'] text-xs font-bold uppercase rounded-sm transition-colors cursor-pointer"
              >
                Execute Sweep Early
              </button>
            </div>
          </div>

          {/* Liquidity Runway Radar */}
          <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#2A2A2A] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]/60">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                LIQUIDITY RUNWAY RADAR
              </span>
              <ShieldCheck className="w-4 h-4 text-[#C5FF00]" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] text-4xl font-extrabold text-white">
                6.4
              </span>
              <span className="font-['Space_Grotesk'] text-sm uppercase text-[#8D9479] font-bold">
                Months Covered
              </span>
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#C8C6C5] leading-relaxed">
              At current average burn of {currentCurrency} 148,500/mo, your liquid fortress reserves sustain standard lifestyle obligations without emergency liquidation.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2A2A2A]/60 text-xs">
              <div className="p-2 bg-[#1C1B1B] rounded-sm">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase block font-bold">
                  Fixed Outflow
                </span>
                <span className="font-['Space_Grotesk'] font-mono font-bold text-white">
                  {currentCurrency} 85,000 / mo
                </span>
              </div>
              <div className="p-2 bg-[#1C1B1B] rounded-sm">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase block font-bold">
                  Discretionary Cap
                </span>
                <span className="font-['Space_Grotesk'] font-mono font-bold text-[#C5FF00]">
                  {currentCurrency} 45,000 / mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Audit Log / Recent Transactions Feed */}
      <section className="bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A2A2A]/60">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-[#C5FF00]" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
              Recent Transactions Audit Ledger
            </h3>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#8E8E93]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger..."
                className="bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm pl-8 pr-3 py-1.5 font-['Plus_Jakarta_Sans'] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#C5FF00]"
              />
            </div>

            <div className="flex items-center bg-[#1C1B1B] border border-[#2A2A2A] p-0.5 rounded-sm">
              {['ALL', 'INCOME', 'EXPENSES', 'FIXED', 'DISCRETIONARY'].map((flt) => {
                const isSelected = activeFilter === flt;
                return (
                  <button
                    key={flt}
                    onClick={() => setActiveFilter(flt)}
                    className={`px-2.5 py-1 font-['Space_Grotesk'] text-[10px] font-mono rounded-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#201F1F] text-[#C5FF00] font-bold border border-[#C5FF00]/40'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {flt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[10px] font-['Space_Grotesk'] font-bold text-[#8D9479] uppercase">
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">MERCHANT / ENTITY</th>
                <th className="py-2.5 px-3">CATEGORY VECTOR</th>
                <th className="py-2.5 px-3">RAIL / METHOD</th>
                <th className="py-2.5 px-3 text-right">SETTLEMENT</th>
                <th className="py-2.5 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40 text-xs font-['Plus_Jakarta_Sans']">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.amount < 0;
                return (
                  <tr key={tx.id} className="hover:bg-[#1C1B1B]/80 transition-colors">
                    <td className="py-3 px-3 font-['Space_Grotesk'] font-mono text-[#8E8E93] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {tx.title}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm font-['Space_Grotesk'] text-[10px] text-[#C8C6C5] uppercase font-bold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-['Space_Grotesk'] font-mono text-[#8E8E93] whitespace-nowrap">
                      {(tx as any).method || 'Electronic Transfer'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap font-['Space_Grotesk'] font-bold">
                      {isIncome ? (
                        <span className="text-[#C5FF00] flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          +{currentCurrency} {Math.abs(tx.amount).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-white flex items-center justify-end gap-1">
                          <ArrowDownRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                          -{currentCurrency} {Math.abs(tx.amount).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="p-1 text-[#8E8E93] hover:text-[#C5FF00] transition-colors cursor-pointer"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            deleteTransaction(tx.id);
                            showToast('Transaction removed from ledger');
                          }}
                          className="p-1 text-[#8E8E93] hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL 1: Adjust Monthly Budget */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-6 max-w-md w-full shadow-2xl rounded-xl flex flex-col gap-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] uppercase tracking-wider font-bold">
                  Financial Envelope
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                  Recalibrate Monthly Budget
                </h3>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="text-[#8E8E93] hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Monthly Inflow Projection ({currentCurrency})
                </label>
                <input
                  type="number"
                  required
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Space_Grotesk'] text-lg font-bold rounded-sm focus:outline-none focus:border-[#C5FF00]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Expense Cap Envelope ({currentCurrency})
                </label>
                <input
                  type="number"
                  required
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Space_Grotesk'] text-lg font-bold rounded-sm focus:outline-none focus:border-[#C5FF00]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
              >
                Apply Financial Recalibration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Existing Transaction */}
      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-6 max-w-md w-full shadow-2xl rounded-xl flex flex-col gap-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] uppercase tracking-wider font-bold">
                  Ledger Modification
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                  Edit Transaction
                </h3>
              </div>
              <button
                onClick={() => setEditingTx(null)}
                className="text-[#8E8E93] hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Merchant / Payee Name
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Plus_Jakarta_Sans'] text-sm rounded-sm focus:outline-none focus:border-[#C5FF00]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Amount ({currentCurrency})
                </label>
                <input
                  type="number"
                  required
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Space_Grotesk'] text-lg font-bold rounded-sm focus:outline-none focus:border-[#C5FF00]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Category Vector
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Plus_Jakarta_Sans'] text-sm rounded-sm focus:outline-none focus:border-[#C5FF00]"
                >
                  <option value="Food">Food & Nutrition</option>
                  <option value="Transport">Transit & Fuel</option>
                  <option value="Shopping">Shopping & Gear</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Health">Health & Recovery</option>
                  <option value="Other">Other Outflows</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
              >
                Save Ledger Updates
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
