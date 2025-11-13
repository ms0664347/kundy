import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';
import 'dayjs/locale/zh-tw';
import dayjs from 'dayjs';
import { mkdir, readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import Swal from 'sweetalert2';
// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [date, setDate] = useState(dayjs());
    const [loadedData, setLoadedData] = useState([]);
    const [loadedExpenseData, setLoadedExpenseData] = useState([]);

    // 📊 統計資料
    const [monthIncome, setMonthIncome] = useState(0);
    const [yearIncome, setYearIncome] = useState(0);
    const [topTool, setTopTool] = useState({ name: '', count: 0 });
    const [topCompany, setTopCompany] = useState({ name: '', total: 0 });
    const [monthWorkDays, setMonthWorkDays] = useState(0);
    const [yearWorkDays, setYearWorkDays] = useState(0);
    const [totalDaysInMonth, setTotalDaysInMonth] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY/MM'));
    const [currentYear, setCurrentYear] = useState(dayjs().format('YYYY'));

    // 📉 支出統計
    const [monthExpense, setMonthExpense] = useState(0);
    const [monthExpenseDays, setMonthExpenseDays] = useState(0);
    const [yearExpense, setYearExpense] = useState(0);
    const [yearExpenseDays, setYearExpenseDays] = useState(0);
    const [topExpense, setTopExpense] = useState({ category: '', total: 0 });


    const dirName = 'data';
    const fileName = `${dirName}/DailyWorkReport.json`;
    const expenseFile = `${dirName}/DailyCostReport.json`;

    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#3085d6',
        });
    };

    // ✅ 讀取全部資料
    const handleLoad = async () => {
        try {
            // 🔹 確保資料夾存在
            await mkdir(dirName, { baseDir: BaseDirectory.AppData, recursive: true });

            let content = '';
            let expenseContent = '';

            try {
                // 🔹 嘗試讀取檔案
                content = await readTextFile(fileName, { baseDir: BaseDirectory.AppData });
                expenseContent = await readTextFile(expenseFile, { baseDir: BaseDirectory.AppData });
            } catch (err) {
                // 🔹 捕捉多種情況（Windows / macOS / Linux）
                const msg = String(err).toLowerCase();
                if (
                    msg.includes('file not found') ||
                    msg.includes('no such file') ||
                    msg.includes('failed to open file') ||
                    msg.includes('os error 2')
                ) {
                    // ✅ 檔案不存在 → 自動建立空 JSON 檔案
                    console.warn('📁  檔案不存在，正在建立空檔案...');
                    await writeTextFile(fileName, '[]', { baseDir: BaseDirectory.AppData });
                    await writeTextFile(expenseFile, '[]', { baseDir: BaseDirectory.AppData });
                    content = '[]';
                    expenseContent = '[]';
                } else {
                    throw err; // 其他錯誤往外拋
                }
            }

            if (!content || content.trim() === '') {
                setLoadedData([]);
                return;
            }

            if (!expenseContent || expenseContent.trim() === '') {
                setLoadedExpenseData([]);
                return;
            }

            const jsonData = JSON.parse(content);
            const expenseJsonData = JSON.parse(expenseContent);

            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                setLoadedData([]);
                return;
            }

            if (!Array.isArray(expenseJsonData) || expenseJsonData.length === 0) {
                setLoadedExpenseData([]);
                return;
            }

            // ✅ 篩選本月資料（降冪排序）
            const now = dayjs();
            const currentMonth = now.format('YYYY/MM');
            const currentYear = now.format('YYYY');

            const filteredData = jsonData
                .filter((item) => item.date && item.date.startsWith(currentMonth))
                .sort((a, b) => {
                    const dateA = dayjs(a.date, 'YYYY/MM/DD');
                    const dateB = dayjs(b.date, 'YYYY/MM/DD');
                    return dateB.diff(dateA);
                });

            const filteredExpenseData = expenseJsonData
                .filter((item) => item.date && item.date.startsWith(currentMonth))
                .sort((a, b) => {
                    const dateA = dayjs(a.date, 'YYYY/MM/DD');
                    const dateB = dayjs(b.date, 'YYYY/MM/DD');
                    return dateB.diff(dateA);
                })

            // ✅ 1. 本月總收入（含加班）
            const monthTotal = filteredData.reduce((sum, item) => {
                const amount = Number(item.amount) || 0;
                const overtime = Number(item.overtimePay) || 0;
                return sum + amount + overtime;
            }, 0);

            // ✅ 1-1本月總支出
            const monthExpenseTotal = filteredExpenseData.reduce((sum, item) => {
                const amount = Number(item.amount) || 0;
                return sum + amount;
            }, 0);

            // ✅ 2. 年度總收入（含加班）
            const yearData = jsonData.filter((item) => item.date && item.date.startsWith(currentYear));
            const yearTotal = yearData.reduce((sum, item) => {
                const amount = Number(item.amount) || 0;
                const overtime = Number(item.overtimePay) || 0;
                return sum + amount + overtime;
            }, 0);

            // ✅ 2-1年度總支出
            const yearExpenseData = expenseJsonData.filter((item) => item.date && item.date.startsWith(currentYear));
            const yearExpenseTotal = yearExpenseData.reduce((sum, item) => {
                const amount = Number(item.amount) || 0;
                return sum + amount;
            }, 0);

            // ✅ 3. 本月最常使用工具
            const toolCount = {};
            filteredData.forEach((item) => {
                const tool = item.tool || '未填寫';
                toolCount[tool] = (toolCount[tool] || 0) + 1;
            });
            const topToolEntry = Object.entries(toolCount).sort((a, b) => b[1] - a[1])[0] || ['', 0];

            // ✅ 3-1 本月支出金額最高的類別
            const expenseTypeSum = {}; // 類別 → 總金額
            filteredExpenseData.forEach((item) => {
                const category = item.category || '未填寫';
                const amount = Number(item.amount) || 0;
                expenseTypeSum[category] = (expenseTypeSum[category] || 0) + amount;
            });

            // ✅ 找出金額最高的類別
            const topExpenseTypeEntry =
                Object.entries(expenseTypeSum).sort((a, b) => b[1] - a[1])[0] || ['', 0];

            const [topExpenseCategory, topExpenseAmount] = topExpenseTypeEntry;


            // ✅ 4. 今年收入最高的公司
            const companySum = {};
            jsonData.forEach((item) => {

                if (item.date && item.date.startsWith(currentYear)) {
                    const company = item.company || '未填寫';
                    const income = (Number(item.amount) || 0) + (Number(item.overtimePay) || 0);
                    companySum[company] = (companySum[company] || 0) + income;
                }
            });
            const topCompanyEntry = Object.entries(companySum).sort((a, b) => b[1] - a[1])[0] || ['', 0];

            // ✅ 5. 本月工作天數（以日期不重複計算）
            const uniqueDays = new Set(filteredData.map(item => item.date)).size;

            // 5-1. 本月總支出天數
            const uniqueExpenseDays = new Set(filteredExpenseData.map(item => item.date)).size;

            // ✅ 6. 本月總天數
            const totalDaysInMonth = now.daysInMonth(); // ✅ 例如 11 月會是 30

            // ✅ 7. 今年工作天數（僅限今年）
            const yearWorkDays = new Set(
                jsonData
                    .filter((item) => item.date && item.date.startsWith(currentYear))
                    .map((item) => item.date)
            ).size;

            // 7-1. 今年總支出天數
            const yearExpenseDays = new Set(yearExpenseData.map((item) => item.date)).size;


            // ✅ 存入 state
            setMonthIncome(monthTotal);
            setYearIncome(yearTotal);
            setTopTool({ name: topToolEntry[0], count: topToolEntry[1] });
            setTopCompany({ name: topCompanyEntry[0], total: topCompanyEntry[1] });
            setMonthWorkDays(uniqueDays); // ✅ 新增
            setTotalDaysInMonth(totalDaysInMonth);
            setYearWorkDays(yearWorkDays);

            setMonthExpense(monthExpenseTotal);
            setMonthExpenseDays(uniqueExpenseDays);
            setYearExpense(yearExpenseTotal);
            setYearExpenseDays(yearExpenseDays);
            setTopExpense({
                category: topExpenseCategory,
                total: topExpenseAmount
            });


            setLoadedData(jsonData);
        } catch (err) {
            console.error('❌ 讀取失敗:', err);
            showAlert('warning', '發生錯誤', '請聯絡阿廷或阿夆工程師');
        }
    };

    useEffect(() => {
        const now = dayjs();
        setCurrentMonth(now.format('MM'));
        setCurrentYear(now.format('YYYY'));
        handleLoad();
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid size={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
                        <EarningCard
                            isLoading={isLoading}
                            monthIncome={monthIncome}
                            monthWorkDays={monthWorkDays}
                            monthExpense={monthExpense}
                            monthExpenseDays={monthExpenseDays}
                            totalDaysInMonth={totalDaysInMonth}
                            currentMonth={currentMonth}
                        />
                    </Grid>
                    <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
                        <TotalOrderLineChartCard
                            isLoading={isLoading}
                            yearIncome={yearIncome}
                            yearWorkDays={yearWorkDays}
                            yearExpense={yearExpense}
                            yearExpenseDays={yearExpenseDays}
                            currentYear={currentYear}
                        />
                    </Grid>
                    <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid size={{ sm: 6, xs: 12, md: 6, lg: 6 }}>
                                <TotalIncomeDarkCard
                                    isLoading={isLoading}
                                    topTool={topTool}
                                    currentMonth={currentMonth}
                                    topExpense={topExpense}
                                />
                            </Grid>
                            <Grid size={{ sm: 6, xs: 12, md: 6, lg: 6 }}>
                                <TotalIncomeLightCard
                                    isLoading={isLoading}
                                    topCompany={topCompany}
                                    currentYear={currentYear}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid size={{ xs: 12 }}>
                        <TotalGrowthBarChart
                            isLoading={isLoading}
                            loadedData={loadedData}   // 👈 全部 or 今年的日誌陣列
                        />
                    </Grid>
                    {/* <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    );
}
