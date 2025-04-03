import React, {useEffect } from "react";
import {inject, observer} from "mobx-react";

const ReLogin = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

    useEffect(() => {
    }, []);

    return (
        <div>
            <h2>ReLogin Bot</h2>
        </div>
    );
    }));

export default ReLogin;
