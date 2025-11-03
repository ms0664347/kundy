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

export default function TotalGrowthBarChart({ isLoading, loadedData = [] }) {
    const [status, setStatus] = React.useState('tool');
    const [year, setYear] = React.useState(dayjs().format('YYYY'));
    const theme = useTheme();
    const { mode } = useConfig();

    const monthLabels = Array.from({ length: 12 }, (_, i) => `${ String(i + 1).padStart(2, '0') }月`);

    const toMonthKey = (dateStr) => {
        const d = dayjs(dateStr, ['YYYY/MM/DD', 'YYYY-MM-DD'], true);
        return d.isValid() ? d.format('YYYY-MM') : null;
    };

    function buildMonthlySeries(data, groupKey, year) {
        if (!Array.isArray(data) || data.length === 0) {
            return { categories: monthLabels, series: [], total: 0 };
        }

        const yearData = data.filter((it) => {
            const m = toMonthKey(it.date);
            return m && m.startsWith(`${ year }-`);
        });

        const acc = new Map();
        const safeNumber = (v) => Number(v) || 0;

        yearData.forEach((it) => {
            const key = (it[groupKey] || '未填寫').trim() || '未填寫';
            const mkey = toMonthKey(it.date);
            const monthIdx = Number(mkey.slice(5, 7)) - 1;
            const income = safeNumber(it.amount) + safeNumber(it.overtimePay);

            if (!acc.has(key)) acc.set(key, Array(12).fill(0));
            acc.get(key)[monthIdx] += income;
        });

        const series = Array.from(acc.entries()).map(([name, arr]) => ({ name, data: arr }));
        const total = series.reduce((sum, s) => sum + s.data.reduce((a, b) => a + b, 0), 0);
        return { categories: monthLabels, series, total };
    }

    const chartData = React.useMemo(() => {
        return buildMonthlySeries(loadedData, status === 'company' ? 'company' : 'tool', year);
    }, [loadedData, status, year]);

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
                                            <Typography variant="subtitle2">Total Growth</Typography>
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
                                            toolbar: { show: true },
                                            background: 'transparent'
                                        },
                                        xaxis: { categories: chartData.categories },
                                        legend: { position: 'bottom' },
                                        tooltip: {
                                            y: {
                                                formatter: (val) => `$${ Number(val || 0).toLocaleString() }`
                                            }
                                        },
                                        plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
                                        dataLabels: { enabled: false },
                                        grid: { borderColor: theme.palette.divider }
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
