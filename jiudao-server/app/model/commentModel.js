const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../../core/db');

class Comment extends Model {
  static async addComment(book_id, content) {
    const comment = await Comment.findOne({
      where: { book_id, content }
    });

    if (!comment) {
      return await Comment.create({
        book_id, content, nums: 1
      });
    } else {
      // 如果评论完全相同,就把已存在的评论加1
      return await comment.increment('nums', { by: 1 });
    }
  }

  static async getBookComments(bookID) {
    const bookcomment = await Comment.findAll({
      where: {
        book_id: bookID,
      }
    });
    return bookcomment;
  }

  // toJSON() {
  //   return {};
  // }
}

Comment.init({
  content: { type: DataTypes.STRING(12) },
  nums: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  book_id: { type: DataTypes.INTEGER }
}, {
  sequelize,
  modelName: 'comment'
});

module.exports = Comment;
