import styles from './tabs.module.scss'
import clsx from 'clsx'

type TabsProps = {
    titles: string[];
    currentValue?: any;
    className?: string;
    onChange?: (value: any) => void;
}
export const Tabs = ({ titles, ...props }: TabsProps) => {
  return (
    <div className={`my-1 w-full font-mechanic uppercase font-semibold text-gray-300 ${props.className || ''}`}>
      <div className={`${styles.menus} overflow-auto`}>
        {
          titles.map((title, id) => title
            ? <div onClick={() => id !== props.currentValue && props.onChange && props.onChange(id)} key={title} className={clsx(styles.menu, 'text-base font-semibold', { [styles.active]: id === props.currentValue })}>
              <span>
                {title}
              </span>
            </div>
            : null)
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
  return (props.value === props.index && props.children) || null
}
