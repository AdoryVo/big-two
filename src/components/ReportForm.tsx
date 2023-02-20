import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Textarea
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import ky from 'ky'
import { useState } from 'react'

interface ReportFormProps {
  onClose: () => void,
  lat: number,
  lng: number
}

export default function ReportForm({ onClose, lat, lng }: ReportFormProps) {
  const [image, setImage] = useState<File|null>(null)

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
    },
    onSubmit: async (values) => {
      onClose()

      const formData = new FormData()

      Object.entries({ ...values, lat, lng }).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value))
      })

      formData.append('image', image || JSON.stringify(null))

      const report = await ky.post('api/report', { body: formData }).json()

      // TODO: Redirect user or prompt modal once done w/ report information
      console.log(report)
    },
  })

  return (
    <ModalContent>
      <ModalHeader>Report an Issue</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <form id="reportForm" onSubmit={formik.handleSubmit}>
          {/* Title */}
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              placeholder="Ex: Pothole Near Highway 55"
              id="title"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              required
            />
          </FormControl>

          {/* Description */}
          <FormControl mt={5}>
            <FormLabel htmlFor="description">
              Description
            </FormLabel>
            <Textarea
              placeholder="Ex: Around 10 cm in diameter..."
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </FormControl>

          {/* Image */}
          <FormControl mt={5}>
            <FormLabel htmlFor="image">
              Picture
            </FormLabel>

            <input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              onChange={(e) => {
                const files = e.currentTarget.files
                if (files)
                  setImage(files[0])
              }}
            />
          </FormControl>

          {/* Category */}
          <FormControl mt={5}>
            <FormLabel htmlFor="category">
              Category
            </FormLabel>
            <Select
              placeholder="Select option"
              id="category"
              name="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              required
            >
              <option value="Road">Road</option>
              <option value="Sidewalk">Sidewalk</option>
              <option value="Off-road">Off-road</option>
            </Select>
          </FormControl>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" type="submit" form="reportForm">
          Submit
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
