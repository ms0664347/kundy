import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets

export default function EarningCard({ isLoading, monthIncome, monthWorkDays, totalDaysInMonth, currentMonth }) {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    aria-hidden={Boolean(anchorEl)}
                    sx={{
                        bgcolor: 'secondary.dark',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: theme.palette.secondary[800],
                            borderRadius: '50%',
                            top: { xs: -85 },
                            right: { xs: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: theme.palette.secondary[800],
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
                                <CalendarMonthTwoToneIcon sx={{ color: '#fff', fontSize: '1.6rem' }} />
                                <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, color: '#fff' }}>
                                    本月 ({currentMonth}月)
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
                                            收入：${monthIncome?.toLocaleString() || '0.00'}
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
                                            ({monthWorkDays}/{totalDaysInMonth} 天)
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

EarningCard.propTypes = {
    isLoading: PropTypes.bool,
    monthIncome: PropTypes.number
};

