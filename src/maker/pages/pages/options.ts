import { Option } from 'types'

export const BoolTypes: Option<boolean>[] = [
    { key: false, label: '否' },
    { key: true, label: '是' },
]

export const ColorTypes: Option<string>[] = [
    { key: 'blue', label: '蓝色' },
    { key: 'red', label: '红色' },
    { key: 'green', label: '绿色' },
    { key: 'orange', label: '橙色' },
    { key: 'yellow', label: '黄色' },
    { key: 'purple', label: '紫色' },
    { key: 'magenta', label: '粉色' },
    { key: 'cyan', label: '青色' },
    { key: 'gray', label: '灰色' },
]

export const NodeTypes: Option<string>[] = [
    { key: 'scene', label: '独立场景' },
    { key: 'container', label: '容器' },
    { key: 'text', label: '文字' },
    { key: 'image', label: '图片' },
    { key: 'button', label: '按钮' },
    { key: 'input', label: '输入框' },
    { key: 'html-editor', label: '富文本输入' },
    { key: 'checkbox', label: '多项框' },
    { key: 'radio', label: '单选框' },
    { key: 'select', label: '下拉框' },
    { key: 'tree', label: '树形框' },
    { key: 'switcher', label: '开关' },
    { key: 'date', label: '日期选框' },
    { key: 'date-range', label: '日期范围' },
    { key: 'uploader', label: '上传' },
    { key: 'table', label: '表格' },
    { key: 'pagination', label: '分页器' },
    { key: 'dialog', label: '对话弹窗' },
    { key: 'tab-pages', label: '多页签' },
    { key: 'form', label: '表单' },
    { key: 'form-field', label: '表单项' },
    { key: 'list', label: '列表' },
    { key: 'iframe', label: '内嵌网页' },
    { key: 'custom', label: '自定义' },
]