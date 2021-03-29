import {
  faHandshake,
  faPoll,
  faUserMd,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp
} from '@fortawesome/free-regular-svg-icons';
import { ColorEnum } from 'enum';
import { WidgetInterface } from 'interfaces';
import routes from 'routes';

const { 
  desktop,
  jobSearchList,
  prescriptionList,
  transferWithFavorites
} = routes

const dashboardWidgets: WidgetInterface[] = [
  {
    name: "Exchange",
    icon: faHandshake,
    backColor: ColorEnum.Green,
    color: ColorEnum.White,
    to: `${desktop}?state=waiting`
  },
  {
    name: "Survey",
    icon: faPoll,
    backColor: ColorEnum.Blue,
    color: ColorEnum.White,
    to: `${desktop}?state=survey`
  },
  {
    name: "EmploymentApplication",
    icon: faUserMd,
    backColor: ColorEnum.Purple,
    color: ColorEnum.White,
    to: jobSearchList
  },
  {
    name: "Prescription",
    icon: faPills,
    backColor: ColorEnum.Orange,
    color: ColorEnum.White,
    to: prescriptionList
  },
  {
    name: "FavoriteListCount",
    icon: faThumbsUp,
    backColor: ColorEnum.Maroon,
    color: ColorEnum.White,
    to: transferWithFavorites,
    titleFontSize: '1em',
  }
]

export default dashboardWidgets
