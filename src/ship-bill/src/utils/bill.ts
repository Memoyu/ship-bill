/**
 * 是否为支出类型
 * 支出: 1, 收入: 2
 */
export const isExpendType = (type: number) => type === 1
export const isIncomeType = (type: number) => type === 2

/**
 * 获取账单类型
 * 支出: 1, 收入: 2
 */
export const getBillType = (type: string) => (isExpendString(type) ? 1 : 2)

/**
 * 是否为支出
 */
export const isExpendString = (type: string) => type === '支出'
