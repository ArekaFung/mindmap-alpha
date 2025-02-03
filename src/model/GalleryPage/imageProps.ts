
type PhotoOrientation = 'portrait' | 'landscape'

export interface PhotoMetaData {
    orientation: PhotoOrientation
    ratio_W: number
    ratio_H: number

    filename: String
    description: String
    captureDate: Date
    captureLocation: String

    cameraData: CameraData
}

export interface PhotoData {
    base64_150?: String
    base64_1080?: String
    base64_original?: String
}

interface CameraData {
    cameraBrand: String
    cameraModel: String
    lensBrand: String
    lensModel: String
    focalLength: number
    aperture: number
    iso: number
    shutterSpeed: number
}