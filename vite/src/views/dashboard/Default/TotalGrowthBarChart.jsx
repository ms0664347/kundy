import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';

import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Swal from 'sweetalert2';

export default function TotalGrowthBarChart({ isLoading, loadedData = [] }) {
    const [status, setStatus] = React.useState('tool');
    const [year, setYear] = React.useState(dayjs().format('YYYY'));
    const theme = useTheme();
    const { mode } = useConfig();

    const monthLabels = Array.from({ length: 12 }, (_, i) => `${ String(i + 1).padStart(2, '0') }月`);

    const fixedColors = ['#cc47f0ff', '#825be7ff', '#4268d9ff', '#6ae759ff', '#e8e853ff'];
    const otherColor = '#dbd9d9ff';


    const toMonthKey = (dateStr) => {
        const d = dayjs(dateStr, ['YYYY/MM/DD', 'YYYY-MM-DD'], true);
        return d.isValid() ? d.format('YYYY-MM') : null;
    };

    function buildMonthlySeries(data, groupKey, year) {
        const monthLabels = Array.from({ length: 12 }, (_, i) => `${ String(i + 1).padStart(2, '0') }月`);
        const toMonthKey = (dateStr) => {
            const d = dayjs(dateStr, ['YYYY/MM/DD', 'YYYY-MM-DD'], true);
            return d.isValid() ? d.format('YYYY-MM') : null;
        };

        const yearData = data.filter(it => {
            const m = toMonthKey(it.date);
            return m && m.startsWith(`${ year }-`);
        });

        const acc = new Map(); // Map<groupName, number[12]>
        const num = (v) => Number(v) || 0;

        // 🔹 先逐筆累積每個公司／工具的每月金額
        yearData.forEach(it => {
            const key = (it[groupKey] || '未填寫').trim() || '未填寫';
            const mkey = toMonthKey(it.date);
            const monthIdx = Number(mkey.slice(5, 7)) - 1;
            const income = num(it.amount) + num(it.overtimePay);

            if (!acc.has(key)) acc.set(key, Array(12).fill(0));
            acc.get(key)[monthIdx] += income;
        });

        // 🔹 計算每個 key 的年度總金額
        const groupTotals = Array.from(acc.entries()).map(([name, arr]) => ({
            name,
            data: arr,
            total: arr.reduce((a, b) => a + b, 0)
        }));

        // 🔹 依 total 金額排序（高→低）
        groupTotals.sort((a, b) => b.total - a.total);

        // 🔹 取前 5 名，其餘合併為「其他」
        const top5 = groupTotals.slice(0, 5);
        const others = groupTotals.slice(5);

        if (others.length > 0) {
            const merged = Array(12).fill(0);
            others.forEach(g => {
                g.data.forEach((v, i) => merged[i] += v);
            });
            top5.push({ name: '其他', data: merged, total: merged.reduce((a, b) => a + b, 0) });
        }

        // 🔹 series：最終傳給 chart 的資料
        const series = top5.map(({ name, data }) => ({ name, data }));

        // 🔹 顏色（前 5 名固定 + 其他灰色）
        const colors = [...fixedColors.slice(0, series.length - 1), otherColor];

        // 🔹 全年總和（顯示在上面卡片）
        const total = series.reduce((sum, s) => sum + s.data.reduce((a, b) => a + b, 0), 0);

        return { categories: monthLabels, series, colors, total };
    }


    const chartData = React.useMemo(() => {
        return buildMonthlySeries(loadedData, status === 'company' ? 'company' : 'tool', year);
    }, [loadedData, status, year]);

    React.useEffect(() => {
        const handler = (e) => {
            const item = e.target.closest('.apexcharts-menu-item');
            if (!item) return;

            if (
                item.textContent.includes('Download PNG') ||
                item.textContent.includes('Download SVG') ||
                item.textContent.includes('Download CSV')
            ) {
                // 下載通常需要 0.5~1 秒生成，所以延遲一點提示
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '下載完成 🎉',
                        text: '圖表已成功儲存到下載資料夾！',
                        showConfirmButton: false,
                        timer: 2000,
                        toast: true,
                        position: 'center',
                        timerProgressBar: true,
                    });
                }, 1000);
            }
        };

        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid size={12}>
                            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid>
                                            <Typography variant="subtitle">總收入</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="h3">${chartData.total.toLocaleString()}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid>
                                    <TextField select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ mr: 2 }}>
                                        <MenuItem value="tool">工具</MenuItem>
                                        <MenuItem value="company">公司</MenuItem>
                                    </TextField>
                                    <TextField select value={year} onChange={(e) => setYear(e.target.value)}>
                                        {[dayjs().format('YYYY'), dayjs().subtract(1, 'year').format('YYYY')].map((y) => (
                                            <MenuItem key={y} value={y}>
                                                {y}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ✅ 圖表安全渲染 */}
                        <Grid size={12}>
                            {chartData.series.length > 0 ? (
                                <Chart
                                    type="bar"
                                    height={400}
                                    series={chartData.series}
                                    options={{
                                        chart: {
                                            id: 'bar-chart',
                                            stacked: true,
                                            background: 'transparent',
                                            toolbar: {
                                                show: true,       // 是否顯示右上角功能列
                                                offsetX: 0,       // X 偏移
                                                offsetY: 0,       // Y 偏移
                                                tools: {
                                                    download: true, // 是否顯示「下載」按鈕（這三條線）
                                                    selection: false,
                                                    zoom: false,
                                                    zoomin: false,
                                                    zoomout: false,
                                                    pan: false,
                                                    reset: false | '<img src="..."/>', // 也可以改成自訂圖示
                                                },
                                                export: {         // ✅ 導出功能的設定都在這裡
                                                    csv: { filename: '年度收入統計' },
                                                    png: { filename: '年度收入統計' },
                                                    svg: { filename: '年度收入統計' }
                                                },
                                                autoSelected: 'zoom'  // 預設選中哪個工具（通常不用）
                                            }
                                            // animations: {
                                            //     enabled: true,    // 切換資料時的動畫
                                            //     speed: 300
                                            // }
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: false, // 橫向長條（false=直向）
                                                columnWidth: '30%', // 長條寬度（百分比或像素）
                                                borderRadius: 6
                                            }
                                        },
                                        xaxis: { // x 軸相關設定
                                            categories: chartData.categories, // 你的 X 軸標籤：月份
                                            labels: {
                                                rotate: 0,               // 是否旋轉文字
                                                style: {                 // MUI 主題可帶進來設定顏色字型
                                                    fontSize: '16px'
                                                }
                                            },
                                            // axisBorder: { show: false },
                                            // axisTicks: { show: false }
                                        },
                                        yaxis: {
                                            labels: {
                                                formatter: (v) => `${ Number(v || 0).toLocaleString() }`, // Y 軸顯示千分位
                                                style: { fontSize: '16px' }
                                            }
                                        },
                                        colors: chartData.colors,
                                        dataLabels: { enabled: false }, // 每個柱子上是否顯示數字（通常關閉較清爽）
                                        legend: {
                                            position: 'bottom', // 圖例放底下
                                            fontSize: '18px',   // ✅ 調整文字大小
                                            markers: {
                                                width: 24,        // ✅ 小圓點寬度
                                                height: 24,       // ✅ 小圓點高度
                                                radius: 4         // ✅ 圓角（0=方形、最大變圓形）
                                            },
                                            itemMargin: {
                                                horizontal: 12,   // ✅ 左右間距
                                                vertical: 6       // ✅ 上下間距
                                            }
                                        },
                                        tooltip: {
                                            shared: true,               // 同一 X 值顯示多個 series 的 tooltip
                                            intersect: false,
                                            y: {
                                                formatter: (v) => `$${ Number(v || 0).toLocaleString() }` // 金額格式
                                            }
                                        },
                                        grid: {
                                            borderColor: 'rgba(0, 0, 0, 0.5)', // 比 theme.palette.divider 深一點
                                            strokeDashArray: 3
                                        }

                                    }}
                                />
                            ) : (
                                <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                                    尚無資料可顯示 📊
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
}

TotalGrowthBarChart.propTypes = { isLoading: PropTypes.bool };
