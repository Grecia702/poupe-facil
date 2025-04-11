import { NavigationContainer } from '@react-navigation/native'
import StackRoutes from './stack'
export default function Routes() {
    return (
        <NavigationContainer>
            <StackRoutes />
        </NavigationContainer >
    )
}