import DefaultLayout from "../../theme/DefaultLayout";
import * as React from "react";
import DataCollector from "./DataCollector";
import DataTable from "./DataTable";
import {ConfirmProvider} from "material-ui-confirm";
import {Card, CardContent, Grid2, useMediaQuery, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import RatingStars from "../utilities/RatingStars";


export default function Journal() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (isMobile) {
        return (
            <DefaultLayout>
                <ConfirmProvider>
                    <DataCollector>
                        {({data}) => (
                            <Grid2 container spacing={2}>
                                {data.map((item) => (
                                    <Grid2 key={item.id} size={{ xs: 12, sm:6, md:4, lg:3}}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h5" component="div">
                                                    {item.bandName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.place}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.comment}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <RatingStars rating={item.rating}/>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>
                        )}
                    </DataCollector>
                </ConfirmProvider>
            </DefaultLayout>
        );
    } else {
        return (
            <DefaultLayout>
                <ConfirmProvider>
                    <DataCollector>
                        {({data, onEdit, onDelete}) => (
                            <DataTable data={data} onEdit={onEdit} onDelete={onDelete}/>
                        )}
                    </DataCollector>
                </ConfirmProvider>
            </DefaultLayout>
        )
    }
}