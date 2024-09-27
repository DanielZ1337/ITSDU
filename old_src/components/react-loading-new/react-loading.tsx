import { useState, useEffect, type ComponentProps } from 'react'

import * as svgSources from './svg'

type LoadingType = keyof typeof svgSources

const Loading = ({
	color = '#fff',
	delay = 0,
	type = 'blank',
	height = 64,
	width = 64,
	...restProps
}: {
	color?: string
	delay?: number
	type?: LoadingType
	height?: number
	width?: number
} & ComponentProps<'div'>) => {
	const [delayed, setDelayed] = useState(delay > 0)

	useEffect(() => {
		let timeout: NodeJS.Timeout | undefined

		if (delayed) {
			timeout = setTimeout(() => {
				setDelayed(false)
			}, delay)
		}

		return () => {
			clearTimeout(timeout)
		}
	}, [delayed, delay])

	const selectedType = delayed ? 'blank' : type
	const svg = svgSources[selectedType]
	const style = {
		fill: color,
		height,
		width,
	}

	return (
		<div
			style={style}
			dangerouslySetInnerHTML={{
				__html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle transform="translate(8 0)" cx="0" cy="16" r="0"> 
    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0"
      keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
  </circle>
  <circle transform="translate(16 0)" cx="0" cy="16" r="0"> 
    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3"
      keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
  </circle>
  <circle transform="translate(24 0)" cx="0" cy="16" r="0"> 
    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6"
      keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
  </circle>
</svg>
`,
			}}
			{...restProps}
		/>
	)
}

export { Loading as ReactLoading }
