import PropTypes from 'prop-types';
import { forwardRef, useState, useEffect } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import { Box, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';

// third party
import { bindToggle } from 'material-ui-popup-state';

// project imports

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';

import { motion, AnimatePresence } from 'framer-motion';


function HeaderAvatarComponent({ children, ...others }, ref) {

    const theme = useTheme();
    return (
        <Avatar
            ref={ref}
            variant="rounded"
            sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                bgcolor: 'secondary.light',
                color: 'secondary.dark',
                '&:hover': {
                    bgcolor: 'secondary.dark',
                    color: 'secondary.light'
                }
            }}
            {...others}
        >
            {children}
        </Avatar>
    );
}

const HeaderAvatar = forwardRef(HeaderAvatarComponent);

// ==============================|| SEARCH INPUT - MOBILE||============================== //

function MobileSearch({ value, setValue, popupState }) {
    const theme = useTheme();

    return (
        <OutlinedInput
            id="input-search-header"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search"
            startAdornment={
                <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <HeaderAvatar>
                        <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
                    </HeaderAvatar>
                    <Box sx={{ ml: 2 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                bgcolor: 'orange.light',
                                color: 'orange.dark',
                                '&:hover': {
                                    bgcolor: 'orange.dark',
                                    color: 'orange.light'
                                }
                            }}
                            {...bindToggle(popupState)}
                        >
                            <IconX stroke={1.5} size="20px" />
                        </Avatar>
                    </Box>
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
            sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
        />
    );
}

// ==============================|| SEARCH INPUT ||============================== //

export default function SearchSection() {

    const [texts, setTexts] = useState([
        'Welcome to Kundy! 😊 Hi! Kundy 你好 😊',
        '工作注意安全，不疲勞駕駛 🚗，今天是個適合上班的好日子 🚜',
        '少抽菸，沒事多喝水，多喝水沒事 💧',
        '爸爸你上班辛苦了 💪 時間不早了，早點休息😎',
    ]);

    const [index, setIndex] = useState(0);


    // 🌦️ 自動載入今日天氣
    useEffect(() => {
        async function fetchWeather() {
            const apiKey = "1068531ca0e8f031aa9585356721e63a";
            const city = "Miaoli";

            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=zh_tw`
                );
                const data = await res.json();

                if (data?.list?.length) {
                    // ✅ 抓今天（只取今日日期的資料）
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const todayForecasts = data.list.filter(item => item.dt_txt.startsWith(todayStr));

                    // ✅ 平均降雨機率（若無 pop 則視為 0）
                    const avgPop = todayForecasts.length
                        ? Math.round(
                            todayForecasts.reduce((sum, item) => sum + (item.pop || 0), 0) /
                            todayForecasts.length *
                            100
                        )
                        : 0;

                    // ✅ 取最接近現在時間的那筆
                    const nowTimestamp = Date.now();
                    const closest = todayForecasts.reduce((prev, curr) => {
                        return Math.abs(new Date(curr.dt_txt) - nowTimestamp) <
                            Math.abs(new Date(prev.dt_txt) - nowTimestamp)
                            ? curr
                            : prev;
                    });

                    const desc = closest.weather[0].description;
                    const temp = Math.round(closest.main.temp);
                    const feels = Math.round(closest.main.feels_like);

                    let icon = "🌤";
                    if (desc.includes("雲")) icon = "☁️";
                    else if (desc.includes("雨")) icon = "🌧️";
                    else if (desc.includes("晴")) icon = "☀️";

                    const weatherMsg = `苗栗今天天氣：${desc}${icon}，氣溫 ${temp}°C，體感 ${feels}°C，降雨機率 ${avgPop}%`;
                    setTexts(prev => [weatherMsg, ...prev]);
                } else {
                    console.warn("⚠️ 無法取得天氣資料", data);
                }
            } catch (err) {
                console.error("❌ 無法取得天氣資料", err);
            }
        }

        fetchWeather();
    }, []);



    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 4000); // 每 3 秒切換一次
        return () => clearInterval(timer);
    }, [texts.length]);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    p: 2,
                    width: '100%',
                    height: '70px',
                    overflow: 'hidden', // 讓動畫只顯示範圍內
                    position: 'relative',
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute' }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                fontSize: '1.4rem',
                                textAlign: 'center',
                            }}
                        >
                            {texts[index]}
                        </Typography>
                    </motion.div>
                </AnimatePresence>


            </Box>
        </>
    );
}

HeaderAvatarComponent.propTypes = { children: PropTypes.node, others: PropTypes.any };

MobileSearch.propTypes = { value: PropTypes.string, setValue: PropTypes.func, popupState: PropTypes.any };
