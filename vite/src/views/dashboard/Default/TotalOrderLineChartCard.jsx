import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TimelineTwoToneIcon from '@mui/icons-material/TimelineTwoTone';
// third party

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets

export default function TotalOrderLineChartCard({ isLoading, yearIncome, yearWorkDays, currentYear }) {
    const theme = useTheme();

    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: 'primary.dark',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        '&>div': {
                            position: 'relative',
                            zIndex: 5
                        },
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: theme.palette.primary[800],
                            borderRadius: '50%',
                            top: { xs: -85 },
                            right: { xs: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: theme.palette.primary[800],
                            borderRadius: '50%',
                            top: { xs: -125 },
                            right: { xs: -15 },
                            opacity: 0.5
                        }
                    }}
                >
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TimelineTwoToneIcon sx={{ color: '#fff', fontSize: '1.6rem' }} />
                                <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, color: '#fff' }}>
                                    今年 ({currentYear}年)
                                </Typography>
                            </Box>
                            <Grid>
                                <Grid
                                    container
                                    direction="column" // 👈 改成垂直排列
                                    sx={{ mt: 1, gap: 0.5 }} // 👈 gap 控制上下間距
                                >
                                    {/* 收入金額 */}
                                    <Grid>
                                        <Typography
                                            sx={{
                                                fontSize: '1.6rem',
                                                fontWeight: 600,
                                                color: '#fff'
                                            }}
                                        >
                                            收入：${yearIncome?.toLocaleString() || '0.00'}
                                        </Typography>
                                    </Grid>

                                    {/* 工作天數區塊 */}
                                    <Grid>
                                        <Typography
                                            sx={{
                                                fontSize: '1.4rem',
                                                color: '#e0e0e0',
                                                fontWeight: 400
                                            }}
                                        >
                                            ({yearWorkDays}/365天)
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
}

TotalOrderLineChartCard.propTypes = { isLoading: PropTypes.bool };
