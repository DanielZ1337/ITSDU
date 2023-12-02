import { ItslearningRestApiEntitiesLocationType } from "./Itslearning.RestApi.Entities.LocationType"

export type ItslearningRestApiEntitiesPlannerPlanPreview = {
    PlanId: number
    TopicId: number
    Order: number
    LocationId: number
    LocationType: ItslearningRestApiEntitiesLocationType
    LocationColor: string
    TopicColor: string
    PlanName: string
    PlanDescription: string
    Start: Date
    Stop: Date
    ClassHours: number
}