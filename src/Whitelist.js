import { useUserStore } from './Store/UserStore.js'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

export default function SwitchList() {
    const [checked, setChecked] = React.useState([]);
    const [localWhitelist, setLocalWhitelist] = React.useState(null);
    const getWhitelist = useUserStore(state => state.getWhitelist)
    const setWhitelist = useUserStore(state => state.setWhitelist)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        console.log(value)
        console.log(newChecked)

        setChecked(newChecked);
    };

    function refreshList() {
        const newChecked = [];
        getWhitelist().then((res) => {
            if (res === null) return
            setLocalWhitelist(res)

            Object.keys(res).forEach((key) => {
                if (res[key].allowed) {
                    newChecked.push(key)
                }
            });
            setChecked(newChecked);
        })
    }

    return (
        <>
            <Button variant="contained" onClick={refreshList}>Connect</Button>
            <Button variant="contained" onClick={() => setWhitelist(checked)}>Update</Button>
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                subheader={<ListSubheader>Settings</ListSubheader>}
            >
                {localWhitelist && Object.keys(localWhitelist).map((key) => {
                    return (
                        <ListItem key={key}>
                            <ListItemText id={key} primary={localWhitelist[key].email} secondary={key} />
                            <Switch
                                edge="end"
                                onChange={handleToggle(key)}
                                checked={checked.indexOf(key) !== -1}
                                inputProps={{
                                    'aria-labelledby': 'switch-list-label-wifi',
                                }}
                            />
                        </ListItem>
                    )
                })}
            </List>
        </>
    );
}