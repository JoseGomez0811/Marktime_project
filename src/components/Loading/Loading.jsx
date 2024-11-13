import styles from './Loading.module.css'

export function Loading(){
    return(
        <div className={styles.loader}>
            <div className={styles.loaderCircle}></div>
        </div>
    )
}