// /**
//  * Created by liuzhimeng.
//  * @date 2019-04-20
//  * @description 描述文案组件
//  */
//
// import React, { PureComponent, useEffect } from 'react'
// import cls from 'classnames'
// import { Typography } from "antd";
// import styles from './index.less'
//
// const { Text } = Typography
//
// export type DescType = 'text' | 'highlight' | 'tag' // 文字类型
// export type DescTextType = number | string | `^hl|.+` | `^tag|.+`
//
// export interface DescriptionItem {
//   readonly id: string
//   text: DescTextType // 文字内容，可以通过正则标记或者type字段区分样式
//   type?: DescType // 文字类型，作用和 DescTextType 一样
//   url?: string // 是否点击跳转
//   style?: TextStyleProps // 只应用到此文本的样式，会覆盖掉props样式
//   wrapperStyle?: ViewStyleProps // 标签容器样式
// }
//
// interface CustomTextProps {
//   data: string | string[] | DescriptionItem[]
//   block: boolean
//   constainerStyle?: ViewStyleProps
//   defaultStyle?: TextStyleProps
//   highlightStyle?: TextStyleProps
//   tagStyle?: TextStyleProps
//   onPress?(item: DescriptionItem, index: number): void
//   onLoad?(): void
// }
//
// const CustomText: React.FC<CustomTextProps> = () => {
//   const { data = null, block = true } = props
//
//   useEffect(() => {
//     if(props.onLoad) {
//       props.onLoad()
//     }
//   }, [])
//
//
//
//   private renderDefault = (text: string, textProps = {}, style) => {
//     return <Text className={cls(styles.defaultText, props.defaultStyle, style)}  {...textProps}>{text}</Text>
//   }
//
//   const {data, block, constainerStyle, highlightStyle, tagStyle, onPress} = props
//
//   if(typeof data === 'string') {
//     return renderDefault(data)
//   }
//
//   if(data && data.length) {
//     const sizeStyle = block ? {width: '100%'} : {}
//
//     return (
//       <View style={[styles.container, sizeStyle, constainerStyle]}>
//         {(data as DescriptionItem[]).map((item, index: number) => {
//           const textInfo = typeof item === 'string' ? {id: `${index}`, text: item} : item
//           const {id, text, type, style, wrapperStyle, url} = textInfo
//           const _text = String(text)
//
//           if(type === 'highlight' || /^hl\|/.test(_text)) {
//             return <Text key={id} style={[styles.highlight, highlightStyle, style]}>{_text.replace(/^hl\|/, '')}</Text>
//           }
//
//           if(type === 'tag' || /^tag\|/.test(_text)) {
//             const touchPress = onPress && url ? () => onPress(item, index) : null
//             return (
//               <span key={id} style={[styles.tagWrapper, wrapperStyle]} onPress={touchPress}>
//                   <Text style={[styles.tag, tagStyle, style]} numberOfLines={1}>{_text.replace(/^tag\|/, '')}</Text>
//                 </span>
//             )
//           }
//
//           return renderDefault(_text, {key: id}, style)
//         })}
//       </View>
//     )
//   }
//
//   return null
//
// }
//
// export default CustomText
