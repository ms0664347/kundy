import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IconBusinessplan } from '@tabler/icons-react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${ theme.palette.warning.dark } -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${ theme.palette.warning.dark } -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

export default function TotalIncomeLightCard({ isLoading, topCompany, currentYear }) {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Grid container direction="column">
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',           // ✅ 同一排
                                alignItems: 'center',      // ✅ 垂直置中
                                gap: 2                     // ✅ 圖示與文字間距
                            }}
                        >
                            <IconBusinessplan
                                sx={{
                                    color: '#7d7575ff',
                                    fontSize: '1.6rem',
                                    verticalAlign: 'middle'
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: '1.125rem',
                                    fontWeight: 500,
                                    color: '#100f0fff'
                                }}
                            >
                                今年 ({currentYear}年)收入最高公司
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2, gap: 2 }} >
                            <Typography
                                sx={{
                                    fontSize: '1.6rem',
                                    fontWeight: 600,
                                    color: '#ae00ffff'
                                }}
                            >
                                {topCompany.name}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: '1.25rem',
                                        color: '#443b3bff',
                                        fontWeight: 400,
                                        ml: 1
                                    }}
                                >
                                    ${topCompany.total?.toLocaleString() || '0.00'}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                </CardWrapper>
            )}
        </>
    );
}

TotalIncomeLightCard.propTypes = { isLoading: PropTypes.bool, total: PropTypes.number, icon: PropTypes.node, label: PropTypes.string };
