import React, { ReactElement, useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";

type ToastProps = { id: number; milliseconds: number; message: string | null };

const { useGlobalState } = createGlobalState<{ toastOptions: ToastProps }>({
    toastOptions: {
        id: 0,
        milliseconds: 0,
        message: "",
    },
});

export function Toast({ milliseconds, message, id }: ToastProps) {
    const [isVisible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        if (milliseconds > 0) {
            setVisible(true);
            setTimeout(() => {
                setVisible(false);
            }, milliseconds);
        }
    }, [id]);

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

export function GlobalToast() {
    const [toastOptions] = useGlobalState("toastOptions");
    return (
        <Toast
            id={toastOptions.id}
            milliseconds={toastOptions.milliseconds}
            message={toastOptions.message}
        />
    );
}

export function useToast(): [(message: string, milliseconds: number) => void] {
    const [toastOptions, setToastOptions] = useGlobalState("toastOptions");
    return [
        function (message: string, milliseconds: number) {
            setToastOptions({
                id: new Date().getTime(),
                milliseconds,
                message,
            });
        },
    ];
}
