import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../app/home";
import ElecteurScreen from "../app/electeur"; 
import CampagneScreen from "../app/campagne";
import ElectionScreen from "../app/election";
import CandidatScreen from "../app/candidat";


const Tab = createBottomTabNavigator();

export default function TabBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#075E54" },
        tabBarActiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="all"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="chatbubble-outline" color={color} size={size} />,
        }}
      />
    
      <Tab.Screen
        name="Electeurs"
        component={ElecteurScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
      
      <Tab.Screen
        name="Élection"
        component={ElectionScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="balloon-outline" color={color} size={size} />,
        }}
      />
      
      <Tab.Screen
        name="Candidat"
        component={CandidatScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
        <Tab.Screen
        name="Campagne"
        component={CampagneScreen}
        options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="megaphone-outline" color={color} size={size} />,
        }}
        />
    </Tab.Navigator>
  );
}