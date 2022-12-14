import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import { Background } from "../../components/Background";
import { GameParams } from "../../@types/navigation";
import { Heading } from "../../components/Heading";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

import logoImg from "../../assets/logo-nlw-esports.png";
import { Entypo } from "@expo/vector-icons";
import { styles } from "./styles";
import { THEME } from "../../theme";

import {API_BASE} from '@env'

export function Game() {
    const [duos, setDuos] = useState<DuoCardProps[]>([]);
    const [discordDuoSelected, setDiscordDuoSelected] = useState('')
    const navigation = useNavigation();
    const route = useRoute();
    const game = route.params as GameParams;

    function handleGoBack() {
        navigation.goBack();
    }

    async function getDiscordUser(adsId: string) {
        fetch(`${process.env.API_BASE}/ads/${adsId}/discord`)
        .then((response) => response.json())
        .then((data) => setDiscordDuoSelected(data.discord));
    }

    useEffect(() => {
        fetch(`${process.env.API_BASE}/games/${game.id}/ads`)
            .then((response) => response.json())
            .then((data) => setDuos(data));
    }, []);

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo
                            name="chevron-thin-left"
                            color={THEME.COLORS.CAPTION_300}
                            size={20}
                        />
                    </TouchableOpacity>
                    <Image source={logoImg} style={styles.logo} />
                    <View style={styles.right} />
                </View>

                <Image
                    source={{ uri: game.bannerUrl }}
                    style={styles.cover}
                    resizeMode="cover"
                />
                <Heading
                    title={game.title}
                    subtitle="Conecte-se e comece a jogar!"
                />
                <FlatList
                    data={duos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <DuoCard data={item} onConnect={ () => getDiscordUser(item.id)}/>}
                    style={styles.containerList}
                    contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyListText}>
                            N??o h?? an??ncios publicados ainda.
                        </Text>
                    )}
                    horizontal
                />
                <DuoMatch
                    visible={discordDuoSelected.length > 0}
                    onClose={() => setDiscordDuoSelected('')}
                    discord={discordDuoSelected}
                />
            </SafeAreaView>
        </Background>
    );
}
