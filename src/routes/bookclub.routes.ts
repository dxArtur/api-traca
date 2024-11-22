import express from 'express';
import { CreateBookClubController } from '../modules/bookclub/create/createBookClubController';
import { EditBookClubController } from '../modules/bookclub/edit/editBookClubController';
import { GetBookClubsController } from '../modules/bookclub/get/getBookClubController';
import { GetAllBookClubsController } from '../modules/bookclub/getAll/getAllBookClubController';

const route = express.Router();

route.post('/bookclub', async (req, res, next) => {
    await CreateBookClubController.getInstance().handle(req, res, next);
});

route.put('/bookclub/:bookclubId', async (req, res, next) => {
    await EditBookClubController.getInstance().handle(req, res, next);
});

/* route.delete('/bookclub/:bookclubId', async (req, res, next) => {
    await delete.getInstance().handle(req, res, next);
}); */

route.get('/bookclub/:bookclubId',async (req, res, next) => {
    await GetBookClubsController.getInstance().handle(req, res, next);
});

route.get('/bookclub',async (req, res, next) => {
    await GetAllBookClubsController.getInstance().handle(req, res, next);
});


export default route;