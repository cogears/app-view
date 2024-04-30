import routes from "./routes";

import { render } from '../index'
import formatter from '../common/formatter'
render({ routes })

console.info(formatter.amount(123456789.12345, 4))