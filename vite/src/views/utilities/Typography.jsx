// material-ui
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import MuiTypography from '@mui/material/Typography';
import React, { useState } from 'react';
import {
    TextField, Button, Select, MenuItem, Checkbox, Radio, Switch, FormControl, InputLabel,
    FormHelperText, FormControlLabel, Card, CardContent, CardActions, Table, TableBody,
    TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

// ==============================|| TYPOGRAPHY ||============================== //

export default function Typography() {

    const [record, setRecord] = useState({ name: '', amount: '' });

    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    // 讀取 localStorage（你可以在畫面上顯示出來）
    const handleLoad = () => {
        const saved = JSON.parse(localStorage.getItem('records') || '[]');
        console.log('目前資料：', saved);
        alert(`目前共有 ${saved.length} 筆資料`);
    };

    const handleSave = () => {
        // 取出舊資料
        const oldRecords = JSON.parse(localStorage.getItem('records') || '[]');
        // 加入新資料
        const newRecords = [...oldRecords, record];
        // 寫回 localStorage
        localStorage.setItem('records', JSON.stringify(newRecords));
        // 清空表單
        setRecord({ name: '', amount: '' });
        alert('已儲存成功 ✅');
    };

    return (
        <MainCard title="Basic Test">
            <Grid container spacing={gridSpacing}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SubCard title="Heading">
                        <Grid container direction="column" spacing={1}>
                            <TextField
                                label="名稱"
                                name="name"
                                value={record.name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="金額"
                                name="amount"
                                type="number"
                                value={record.amount}
                                onChange={handleChange}
                                fullWidth
                            />
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                💾 儲存
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleLoad}
                                fullWidth
                            >
                                📂 讀取
                            </Button>
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SubCard title="Sub title">
                        <Grid container direction="column" spacing={1}>
                            <Grid>
                                <MuiTypography variant="subtitle1" gutterBottom>

                                </MuiTypography>
                            </Grid>
                            <Grid>
                                <MuiTypography variant="subtitle2" gutterBottom>

                                </MuiTypography>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SubCard title="Body">
                        <Grid container direction="column" spacing={1}>
                            <Grid>
                                <MuiTypography variant="body1" gutterBottom>

                                </MuiTypography>
                            </Grid>
                            <Grid>
                                <MuiTypography variant="body2" gutterBottom>

                                </MuiTypography>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SubCard title="Extra">
                        <Grid container direction="column" spacing={1}>
                            <Grid>
                                <MuiTypography variant="button" gutterBottom sx={{ display: 'block' }}>

                                </MuiTypography>
                            </Grid>
                            <Grid>
                                <MuiTypography variant="caption" gutterBottom sx={{ display: 'block' }}>

                                </MuiTypography>
                            </Grid>
                            <Grid>
                                <MuiTypography variant="overline" gutterBottom sx={{ display: 'block' }}>

                                </MuiTypography>
                            </Grid>
                            <Grid>
                                <MuiTypography
                                    variant="body2"
                                    color="primary"
                                    component={Link}
                                    href="https://berrydashboard.io"
                                    target="_blank"
                                    underline="hover"
                                    gutterBottom
                                    sx={{ display: 'block' }}
                                >

                                </MuiTypography>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid>
        </MainCard>
    );
}
