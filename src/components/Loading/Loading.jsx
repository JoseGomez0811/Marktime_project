import styles from './Loading.module.css'

export function Loading(){
    return(
        <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}>
            <div className={styles["loading-circle"]}></div>
            <div className={styles["loading-circle"]}></div>
            <div className={styles["loading-circle"]}></div>
        </div>
        <h2 className={styles["loading-text"]}>Cargando</h2>
        <p className={styles["loading-subtext"]}>Por favor, espere un momento...</p>
        </div>
    )
}