import styles from './tabs.module.scss'
import clsx from 'clsx'

type TabsProps = {
    titles: string[];
    currentValue?: any;
    onChange?: (value: any) => void;
}
export const Tabs = ({ titles, ...props }: TabsProps) => {
  return (
        <div className='my-1 w-full'>
            <div className={styles.menus}>
                {
                    titles.map((title, id) =>
                        <div onClick={() => id !== props.currentValue && props.onChange && props.onChange(id)} key={title} className={clsx(styles.menu, 'text-base font-semibold', { [styles.active]: id === props.currentValue })}>
                            <span>
                                {title}
                            </span>
                        </div>)
                }
            </div>
        </div>
  )
}

type TabPanelProps = {
    value: any;
    index: any;
    children?: any;
}
export const TabPanel = (props: TabPanelProps) => {
  return (
    props.value === props.index ? <div>{props.children}</div> : <></>
  )
}
