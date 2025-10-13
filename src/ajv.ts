import Ajv from 'ajv'

export const ajv = new Ajv({ allErrors: true })
ajv.addFormat('file', {
	type: 'string',
	validate: () => true,
})

