import React, { useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";

type ToastProps = { key: number; milliseconds: number; message: string };

const { useGlobalState } = createGlobalState<{ toastOptions: ToastProps }>({
    toastOptions: {
        key: 0,
        milliseconds: 0,
        message: "",
    },
});

function Toast({ milliseconds, message }: ToastProps) {
    const [isVisible, setVisible] = useState<boolean>(milliseconds > 0 ? true : false);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, milliseconds);
    }, [milliseconds]);
    return isVisible ? (
        <div
            className="bg-slate-200 p-4 rounded"
            style={{
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                top: "3%",
            }}
        >
            {message}{" "}
        </div>
    ) : (
        <></>
    );
}

export default Toast;

export function useToast(): [(message: string, milliseconds: number) => void, ToastProps] {
    const [toastOptions, setToastOptions] = useGlobalState("toastOptions");

    return [
        function (message: string, milliseconds: number) {
            setToastOptions({
                key: new Date().getMilliseconds(),
                milliseconds,
                message,
            });
        },
        toastOptions,
    ];
}
