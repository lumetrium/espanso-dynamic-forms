
export interface FormMeta {
	/** Name of the form */
	name?: string
	/** Description of the form */
	description?: string
	/** Version of the form */
	version?: string
	/** Author of the form */
	author?: string

	/** Window title */
	title?: string
	/** Window width in pixels */
	width?: number
	/** Window height in pixels */
	height?: number
	/** Window opacity (0.0 - 1.0) */
	opacity?: number
	/** Initial window X position */
	x?: number
	/** Initial window Y position */
	y?: number
}
