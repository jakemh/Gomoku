class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :destroy]

  def index
    setup_new
  end

  def show

  end

  # called when new game is set up 

  def setup_new
    session[:data] ||= {}
    data = session[:data]

    # use init_val to set min values (2nd param) -- if less than min, return nil
    # necessary to make sure there are no values of nil off the bat AND that values are valid
    @rows = validate(data['rows'], 1) || Defaults::BOARD_SIZE_DEFAULT
    @time_limit = validate(data['time_limit'], 3) || Defaults::TIME_LIMIT
    @win_chain =  validate(data['win_chain'], 2) || Defaults::CHAIN_SIZE_DEFAULT
    @depth =  validate(data['depth'], 2)  || Defaults::DEPTH_DEFAULT
    @moves_considered =  validate(data['moves_considered'], 10) || Defaults::MOVES_CONSIDERED
    @aggressiveness = validate(data['aggressiveness'], 0) || Defaults::AGGRESSIVENESS
    @defensiveness =  validate(data['defensiveness'], 0) || Defaults::DEFENSIVENESS
    @win_chain = [@win_chain, @rows].min
    @game = Game.new({ 
                      rows: @rows,
                      board: Array.new(@rows) { Array.new(@rows) { ' ' } }.transpose,
                      win_chain: @win_chain,
                      moves_considered: @moves_considered,
                      depth: @depth,
                      time_limit: @time_limit,
                      defensiveness: @defensiveness,
                      aggressiveness: @aggressiveness })

    @game.save
    @game.update_attributes({game_id: @game.id})
    session[:game] = @game.id
    session[:data][:move_num] = 0
    session[:win_chain] = @win_chain
  end

  def new
    setup_new
    respond_to do |format|
      format.json { render json: @game, status: :created }
    end
  end


  def receive_human_move
    setup_new_game if params['newGame'] == 'true'

    move = params['coord']
    game = Game.find(session[:game])
    game.add_x_at_coord([move[0], move[1]])
    p1_moves = game.p1_moves || []
    game.update_attributes(:p1_moves => p1_moves.push([move[0].to_i, move[1].to_i]))
  end

 def force_move


 end

  def send_ai_move
    game0 = Game.find(session[:game])
    game0.update_attributes({ temp_data: nil, backup_move: nil, status: 'pending' })

    Thread.new do
      t1 = Time.now.to_f
      ActiveRecord::Base.connection_pool.with_connection do |conn|
        data = Gomoku::AI.get_response_data(game0)
        game = Game.find(session[:game])
        game.update_attributes(data)
        t2 = Time.now.to_f
        printf "\nElapsed time: %s seconds ", (t2 - t1).round(2)
      end
    end
  end

  def send_ai_move_retry
    Gomoku::AI.mainMultiAgent.forceTimeExpire if time_expired?(params)
    respond_to do |format|
      format.json { render json: get_move || { status: 'processing' }}
    end
  end

  def get_move
    game = Game.find(session[:game])
    # m = game.temp_data
    if game.status != 'pending'
      game_data = { board: game.board,
          id: game.id,
           win_chain_array: game.win_chain_array,
           p2_moves: game.p2_moves,
           coord: game.p2_moves.last,
           score: game.white_score,
           status: game.status,
           depth: game.depth}
      printf "\np1_moves: %s (%i) \np2_moves: %s (%i)", game.p1_moves, game.p1_moves.length, game.p2_moves, game.p2_moves.length

    end

    return game_data if game_data != nil
    false
  end

  # GET /games/1/edit
  def edit; end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(game_params)

    respond_to do |format|
      if @game.save
        format.html { redirect_to @game, notice: 'Game was successfully created.' }
        format.json { render action: 'show', status: :created, location: @game }
      else
        format.html { render action: 'new' }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /games/1
  # PATCH/PUT /games/1.json
  def update
    puts params
    respond_to do |format|
      session[:data] = game_params
      # puts "SESSION DATA: ", session[:data]
      if @game.update(game_params)
        format.json { render json: @game }
      else
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1
  # DELETE /games/1.json
  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to games_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game

      @game = Game.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_params
      params[:game].permit(:time_limit, :rows, :depth,
                           :moves_considered, :win_chain,
                           :defensiveness, :aggressiveness)
    end
end
